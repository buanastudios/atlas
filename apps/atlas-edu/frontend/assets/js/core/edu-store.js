/**
 * Project Atlas Edu — Core Data Store with Dynamic Custom App Menus Persistence
 * Developed by Buana Studios (Hikmatullah Sakti Buana @thesaktibuana)
 */

window.EduStore = (function() {
    let customAppMenus = [];

    function init() {
        const localCustom = localStorage.getItem('atlas_edu_custom_menus');
        if (localCustom) {
            try { customAppMenus = JSON.parse(localCustom); } catch(e){}
        }
    }

    function addCustomMenu(menu) {
        customAppMenus.push(menu);
        localStorage.setItem('atlas_edu_custom_menus', JSON.stringify(customAppMenus));
    }

    let unitWorkspaces = {
        preschool: {
            name: "Preschool & Kindergarten (TK / PAUD)",
            modules: ["Growth Milestones", "Daily Care Log", "Parent Pickup Verification"],
            students: [{ name: "Yusuf (4 yrs)", status: "Milestone 95%", pickup: "Authorized (Umm Yusuf)" }]
        },
        primary: {
            name: "Primary School (SD / MI)",
            modules: ["Calistung & Literacy", "Daily Homework Log", "Character Building"],
            students: [{ name: "Aisyah Humaira (Grade 4)", status: "Reading Level A", homework: "Math Page 14 Done" }]
        },
        junior: {
            name: "Junior High School (SMP / MTs)",
            modules: ["Subject Class Schedule", "Tahfidh Juz 1-15", "Olympiad Clubs"],
            students: [{ name: "Fatimah Az-Zahra (Grade 8)", status: "8 Juz Mutqin", club: "Robotics Club" }]
        },
        senior: {
            name: "Senior High School (SMA / MA / SMK)",
            modules: ["UTBK University Prep", "Vocational Skills", "Aikido & Archery"],
            students: [{ name: "Muhammad Ali (Grade 11)", status: "Target: UI Computer Science", utbkScore: 710 }]
        },
        diploma2: {
            name: "Diploma 2 (D2) Arabic Language & Sharia Institute (Ma'had Aly D2)",
            modules: ["Nahwu & Shorof Advanced Immersion", "Balaghah & Arabic Literature", "Teaching Practicum (Micro-Teaching)"],
            students: [{ name: "Thariq (D2 Arabic Semester 3)", status: "Mu'adalah Certified", gpa: "3.92 (Mumtaz)" }]
        },
        idad_prep: {
            name: "'Idad Lughawi, TOAFL & Overseas University Prep School (إعداد لغوي / TOAFL / IELTS)",
            modules: [
                "TOAFL Arabic Proficiency Certification (اختبار اللغة العربية - Fahm, Tarkib, Kitabah)",
                "'Idad Lughawi Middle East Prep (Al-Azhar / Madinah Placement Exam)",
                "IELTS Academic 7.5+ & TOEFL iBT Intensive",
                "Overseas Embassy & Visa Dossier Check"
            ],
            students: [
                { name: "Hassan (Prep Cohort 2026)", status: "Al-Azhar Entrance Exam Ready", toaflScore: "620 (Mumtaz)", ieltsScore: "Target 7.5" }
            ]
        },
        university: {
            name: "University & Higher Education (STAI / Kampus)",
            modules: ["SKS & KRS Registration", "Thesis (Skripsi / Munaqasyah)", "Journal Publications"],
            students: [{ name: "Hikmatullah (Semester 8)", status: "Thesis Approved", sks: 144 }]
        }
    };

    init();

    return {
        getUnitWorkspace: (unitKey) => unitWorkspaces[unitKey] || unitWorkspaces.idad_prep,
        getCustomMenus: () => customAppMenus,
        addCustomMenu
    };
})();
