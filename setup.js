/**
 * setup.js — One-shot local development setup
 *
 * Creates local.db with the full Atlas Edu schema + demo seed data.
 * Run once before starting the dev server:
 *
 *   node setup.js
 *
 * Safe to re-run — all statements are idempotent (INSERT OR IGNORE / IF NOT EXISTS).
 */

const { db, initSchema } = require('./api/_db');

async function main() {
  console.log('\n🏫  Atlas Edu — Local DB Setup');
  console.log('─'.repeat(50));

  try {
    await initSchema();
    console.log('\n✅  Database ready!  (local.db)');

    // Quick sanity check
    const students = await db.execute('SELECT COUNT(*) as n FROM students');
    const employees = await db.execute('SELECT COUNT(*) as n FROM employees');
    const subjects = await db.execute('SELECT COUNT(*) as n FROM curriculum_subjects');

    console.log(`\n📊  Seed data loaded:`);
    console.log(`    Students  : ${students.rows[0].n}`);
    console.log(`    Employees : ${employees.rows[0].n}`);
    console.log(`    Subjects  : ${subjects.rows[0].n}`);

    console.log('\n🚀  Next step — start the dev server:');
    console.log('    cmd /c "npx vercel dev"\n');

  } catch (err) {
    console.error('\n❌  Setup failed:', err.message);
    process.exit(1);
  }
}

main();
