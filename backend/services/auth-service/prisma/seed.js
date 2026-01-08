require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");


const prisma = new PrismaClient();

async function main() {
    const email = process.env.ADMIN_EMAIL
    const password = process.env.ADMIN_PASSWORD; // Change this to your desired password
    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await prisma.user.upsert({
        where: { email },
        update: {}, // If exists, do nothing
        create: {
            email,
            passwordHash: hashedPassword,
            firstName: "Super",
            lastName: "Admin",
            role: "ADMIN",
        },
    });

    console.log("Admin user seeded:", admin.email);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
