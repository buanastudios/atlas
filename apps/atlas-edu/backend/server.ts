/**
 * Project Atlas — Edu Vertical Server Engine (`atlas-edu`)
 * Developed by Buana Studios (Hikmatullah / Abu Hafidz @thesaktibuana)
 */

export interface EduCourse {
  id: string;
  code: string;
  name: string;
  nameArabic?: string;
  description: string;
  isActive: boolean;
}

export class AtlasEduService {
  private courses: EduCourse[] = [
    { id: '1', code: 'EDU-01', name: 'Aikido', nameArabic: 'أيكيدو', description: 'Seni bela diri Aikido', isActive: true },
    { id: '2', code: 'EDU-02', name: 'Calligraphy', nameArabic: 'الخط العربي', description: 'Seni khat & kaligrafi islam', isActive: true }
  ];

  public async getCourses(): Promise<EduCourse[]> {
    return this.courses;
  }
}
