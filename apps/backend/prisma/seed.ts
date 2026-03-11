import { PrismaClient, Role } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await argon2.hash('Passw0rd!');

  const specialty = await prisma.specialty.upsert({
    where: { id: 'cardio' },
    update: {},
    create: { id: 'cardio', nameEn: 'Cardiology', nameAr: 'أمراض القلب' },
  });

  const clinic = await prisma.clinic.create({
    data: { name: 'Al-Rafidain Clinic', city: 'Baghdad', address: 'Karrada, Baghdad' },
  });

  const superAdmin = await prisma.user.create({
    data: {
      name: 'System Admin',
      email: 'admin@demo.iq',
      role: Role.SUPER_ADMIN,
      passwordHash,
      phone: '+9647700000001',
    },
  });

  const doctorUser = await prisma.user.create({
    data: { name: 'Dr. Ali Hassan', phone: '+9647700000002', role: Role.DOCTOR, passwordHash },
  });

  const patient = await prisma.user.create({
    data: {
      name: 'Sara Mohammed',
      phone: '+9647700000003',
      email: 'patient@demo.iq',
      role: Role.PATIENT,
      passwordHash,
    },
  });

  const doctor = await prisma.doctor.create({
    data: {
      userId: doctorUser.id,
      clinicId: clinic.id,
      specialtyId: specialty.id,
      bioEn: '10 years experience',
      bioAr: '10 سنوات خبرة',
      consultationFee: 50000,
    },
  });

  await prisma.availability.createMany({
    data: [
      { doctorId: doctor.id, dayOfWeek: 0, startTime: '09:00', endTime: '14:00' },
      { doctorId: doctor.id, dayOfWeek: 2, startTime: '09:00', endTime: '14:00' },
    ],
  });

  console.log({ superAdmin: superAdmin.email, patient: patient.phone });
}

main().finally(() => prisma.$disconnect());
