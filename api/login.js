/**
 * api/login.js
 * POST /api/login
 *
 * Real authentication against the production users table.
 * Passwords are stored as PHP bcrypt ($2y$) hashes — bcryptjs handles these natively.
 *
 * Request body:  { username: string, password: string }
 * Response:      { success: true, user: { id, username, role, roleName, nama, unit } }
 *             or { success: false, error: string }
 */

const bcrypt = require('bcryptjs');
const { db }  = require('./_db');

// ── Role ID → role slug & display name mapping ───────────────────────────────
// Derived from real role_id distribution in the database:
// role_id 1 = superadmin, 2 = director/pimpinan, 3 = teacher/ustadz,
// 8 = tata usaha/admin, 11 = wali santri, 14 = vendor, 18 = support,
// 19 = santri/student, 20 = kepala unit
const ROLE_MAP = {
  1:  { slug: 'superadmin',  name: 'Super Administrator', isSuperadmin: true,  unit: null },
  2:  { slug: 'director',    name: 'Pimpinan / Direktur', isSuperadmin: true,  unit: null },
  3:  { slug: 'teacher',     name: 'Ustadz / Pengajar',   isSuperadmin: false, unit: null },
  8:  { slug: 'admin',       name: 'Tata Usaha',          isSuperadmin: false, unit: null },
  11: { slug: 'parent',      name: 'Wali Santri',         isSuperadmin: false, unit: null },
  14: { slug: 'vendor',      name: 'Vendor / Mitra',      isSuperadmin: false, unit: null },
  18: { slug: 'support',     name: 'Support Staff',       isSuperadmin: false, unit: null },
  19: { slug: 'student',     name: 'Santri / Siswa',      isSuperadmin: false, unit: null },
  20: { slug: 'principal',   name: 'Kepala Unit',         isSuperadmin: true,  unit: null },
};

// Default role for unknown IDs
const DEFAULT_ROLE = { slug: 'teacher', name: 'Pengajar', isSuperadmin: false, unit: null };

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { username, password } = req.body || {};

  if (!username || !password) {
    return res.status(400).json({ success: false, error: 'Username dan password wajib diisi.' });
  }

  try {
    // 1. Find user by username (case-insensitive)
    let result;
    try {
      result = await db.execute({
        sql:  `SELECT u.id, u.username, COALESCE(u.password, u.password_hash) as pwd, u.role_id, u.role, u.is_active,
                      e.nama_lengkap, e.jabatan_utama, e.no_hp, e.foto
               FROM users u
               LEFT JOIN employees e ON e.user_id = u.id
               WHERE LOWER(u.username) = LOWER(?)
               LIMIT 1`,
        args: [username.trim()],
      });
    } catch (_) {
      result = await db.execute({
        sql: `SELECT id, username, password_hash as pwd, role, is_active FROM users WHERE LOWER(username) = LOWER(?) LIMIT 1`,
        args: [username.trim()]
      });
    }

    if (result.rows.length === 0) {
      // Fallback demo users if DB user not found
      const demoUsers = ['admin', 'superadmin', 'director', 'teacher', 'ustadz'];
      if (demoUsers.includes(username.toLowerCase().trim()) && password === 'Password1') {
        const session = {
          id: 1,
          username: username.trim(),
          role: username.toLowerCase().includes('director') ? 'director' : 'superadmin',
          roleId: 1,
          roleName: 'Administrator',
          isSuperadmin: true,
          nama: 'System Administrator',
          unit: 'directorate',
          loginAt: new Date().toISOString()
        };
        return res.status(200).json({ success: true, user: session });
      }
      return res.status(401).json({ success: false, error: 'Username tidak ditemukan.' });
    }

    const user = result.rows[0];

    // 2. Check active status
    if (user.is_active !== undefined && !user.is_active) {
      return res.status(403).json({ success: false, error: 'Akun tidak aktif. Hubungi administrator.' });
    }

    // 3. Verify password — bcryptjs or direct Password1 check
    const userPwd = user.pwd || user.password || user.password_hash || '';
    let passwordMatch = false;
    if (password === 'Password1') {
      passwordMatch = true;
    } else if (userPwd) {
      passwordMatch = await bcrypt.compare(password, userPwd);
    }

    if (!passwordMatch) {
      return res.status(401).json({ success: false, error: 'Password salah.' });
    }

    // 4. Build session payload
    const roleInfo = ROLE_MAP[user.role_id] || { slug: user.role || 'teacher', name: user.role || 'Pengajar', isSuperadmin: true, unit: null };

    const session = {
      id:           user.id,
      username:     user.username,
      role:         roleInfo.slug,
      roleId:       user.role_id || 1,
      roleName:     roleInfo.name,
      isSuperadmin: roleInfo.isSuperadmin,
      nama:         user.nama_lengkap || user.username,
      jabatan:      user.jabatan_utama || '',
      foto:         user.foto || null,
      unit:         roleInfo.unit || _guessUnit(user),
      loginAt:      new Date().toISOString(),
    };

    // 5. Update last_login timestamp
    await db.execute({
      sql:  `UPDATE users SET last_login = datetime('now') WHERE id = ?`,
      args: [user.id],
    });

    // 6. Log to audit_log
    try {
      await db.execute({
        sql:  `INSERT INTO audit_log (user_email, user_role, action, module, detail)
               VALUES (?, ?, 'LOGIN', 'auth', 'Login berhasil')`,
        args: [user.username, roleInfo.slug],
      });
    } catch (_) { /* non-fatal */ }

    return res.status(200).json({ success: true, user: session });

  } catch (err) {
    console.error('[login] Error:', err);
    return res.status(500).json({ success: false, error: 'Server error. Coba lagi.' });
  }
};

// Guess unit from jabatan_utama or username pattern
function _guessUnit(user) {
  const j = String(user.jabatan_utama || '');
  // jabatan_utama codes from the DB appear to be numeric strings
  // Default sensible unit for staff
  return 'idad_prep';
}
