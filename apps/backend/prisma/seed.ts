import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
const prisma = new PrismaClient();

async function main() {
  const pass = await bcrypt.hash('Password123!', 10);
  const users = [
    ['super@demo.iq', 'Super Admin', 'SUPER_ADMIN'],
    ['admin@demo.iq', 'Clinic Admin', 'CLINIC_ADMIN'],
    ['doctor@demo.iq', 'Dr. Ahmed', 'DOCTOR'],
    ['reception@demo.iq', 'Reception', 'RECEPTIONIST'],
    ['patient@demo.iq', 'Patient Demo', 'PATIENT'],
  ] as const;
  for (const [email, name, role] of users) {
    await prisma.user.upsert({ where: { email }, update: {}, create: { email, name, role: role as any, passwordHash: pass } });
  }
  const cardio = await prisma.specialty.upsert({ where: { id: 'cardio' }, update: {}, create: { id: 'cardio', name: 'Cardiology' } });
  const clinic = await prisma.clinic.upsert({ where: { id: 'baghdad-clinic' }, update: {}, create: { id: 'baghdad-clinic', name: 'Baghdad Health Center', city: 'Baghdad', address: 'Karrada, Baghdad' } });
  const doctorUser = await prisma.user.findUniqueOrThrow({ where: { email: 'doctor@demo.iq' } });
  const doctor = await prisma.doctor.upsert({ where: { userId: doctorUser.id }, update: {}, create: { userId: doctorUser.id, clinicId: clinic.id, specialtyId: cardio.id, bio: 'Experienced cardiologist' } });
  for (let d = 0; d < 5; d++) {
    await prisma.schedule.upsert({ where: { id: `${doctor.id}-${d}` }, update: {}, create: { id: `${doctor.id}-${d}`, doctorId: doctor.id, dayOfWeek: d, startTime: '09:00', endTime: '15:00' } });
  }
}

main().finally(() => prisma.$disconnect());
