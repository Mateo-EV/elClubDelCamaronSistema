import { hash } from "@/lib/argon";
import { PrismaClient, TableStatus, UserRole } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

async function main() {
  // Hashed password para usuarios (mozos y administradores)
  const hashedPassword = await hash("password123");

  // Creando Secciones
  const section1 = await prisma.section.create({
    data: { name: "Platos" },
  });

  const section2 = await prisma.section.create({
    data: { name: "Bebidas" },
  });

  const section3 = await prisma.section.create({
    data: { name: "Cocteles" },
  });

  // Creando Categorías
  const category1 = await prisma.category.create({
    data: { name: "Mariscos" },
  });

  const category2 = await prisma.category.create({
    data: { name: "Carnes" },
  });

  const category3 = await prisma.category.create({
    data: { name: "Aperitivos" },
  });

  // Creando Productos (Platos Criollos, Bebidas, Cocteles)
  await prisma.product.createMany({
    data: [
      // Platos Criollos
      {
        name: "Lapas Arrebozadas",
        description: "Lapas cubiertas con una fina capa crujiente",
        price: 35.0,
        stock: 10,
        categoryId: category1.id,
        sectionId: section1.id,
      },
      {
        name: "Milanesa de Pollo",
        description: "Milanesa de pollo empanizada con acompañamientos",
        price: 32.0,
        stock: 15,
        categoryId: category2.id,
        sectionId: section1.id,
      },
      {
        name: "Pollo a la Plancha",
        description: "Pollo jugoso a la plancha con guarniciones",
        price: 28.0,
        stock: 12,
        categoryId: category2.id,
        sectionId: section1.id,
      },
      {
        name: "Chicharrón de Pescado",
        description: "Pescado frito crujiente con salsas especiales",
        price: 32.0,
        stock: 20,
        categoryId: category1.id,
        sectionId: section1.id,
      },
      {
        name: "Ceviche de Pescado",
        description: "Fresco ceviche de pescado con limón y camote",
        price: 28.0,
        stock: 10,
        categoryId: category1.id,
        sectionId: section1.id,
      },
      {
        name: "Trucha Frita",
        description: "Trucha fresca frita con acompañamiento",
        price: 35.0,
        stock: 10,
        categoryId: category1.id,
        sectionId: section1.id,
      },
      {
        name: "Pejerrey Frito",
        description: "Delicioso pejerrey frito",
        price: 35.0,
        stock: 8,
        categoryId: category1.id,
        sectionId: section1.id,
      },
      {
        name: "Chicharrón de Pollo",
        description: "Chicharrón crujiente de pollo con acompañamientos",
        price: 32.0,
        stock: 15,
        categoryId: category2.id,
        sectionId: section1.id,
      },

      // Menú Infantil
      {
        name: "Chicharrón de Pollo + Helado",
        description: "Chicharrón con una bola de helado",
        price: 26.0,
        stock: 5,
        categoryId: category2.id,
        sectionId: section1.id,
      },
      {
        name: "Chicharrón de Pescado + Helado",
        description: "Chicharrón de pescado con helado",
        price: 26.0,
        stock: 5,
        categoryId: category1.id,
        sectionId: section1.id,
      },

      // Bebidas
      {
        name: "Agua 1/2 Litro",
        description: "Agua mineral embotellada",
        price: 3.0,
        stock: 50,
        categoryId: category3.id,
        sectionId: section2.id,
      },
      {
        name: "Coca Cola 1/2 Litro",
        description: "Coca Cola en botella de 1/2 litro",
        price: 4.5,
        stock: 30,
        categoryId: category3.id,
        sectionId: section2.id,
      },
      {
        name: "Inca Kola 1 Litro",
        description: "Inca Kola de 1 litro",
        price: 8.0,
        stock: 25,
        categoryId: category3.id,
        sectionId: section2.id,
      },
      {
        name: "Chicha Morada 1 Litro",
        description: "Tradicional chicha morada de 1 litro",
        price: 10.0,
        stock: 20,
        categoryId: category3.id,
        sectionId: section2.id,
      },

      // Cocteles
      {
        name: "Pisco Sour",
        description: "Pisco Sour tradicional",
        price: 18.0,
        stock: 15,
        categoryId: category3.id,
        sectionId: section3.id,
      },
      {
        name: "Algarrobina",
        description: "Cóctel a base de algarrobina",
        price: 18.0,
        stock: 10,
        categoryId: category3.id,
        sectionId: section3.id,
      },
      {
        name: "Mojito Clásico",
        description: "Mojito clásico con hierbabuena",
        price: 17.0,
        stock: 10,
        categoryId: category3.id,
        sectionId: section3.id,
      },
      {
        name: "Piña Colada",
        description: "Cóctel tropical de piña colada",
        price: 19.0,
        stock: 12,
        categoryId: category3.id,
        sectionId: section3.id,
      },
    ],
  });

  await prisma.user.create({
    data: {
      firstName: "Mateo",
      lastName: "Rioja",
      email: "mateo.rioja@restaurante.com",
      phone: "977895791",
      address: "Jr. Secundaria 456",
      dni: "77030292",
      password: hashedPassword,
      role: UserRole.ADMIN,
    },
  });

  // Creando Waiter y Admin, y asociándolos a User
  const waiter = await prisma.user.create({
    data: {
      firstName: "Carlos",
      lastName: "Lopez",
      email: "carlos.lopez@restaurante.com",
      phone: "987654321",
      address: "Av. Principal 123",
      dni: "77030293",
      password: hashedPassword,
      role: UserRole.WAITER,
      activeOrdersCount: 1,
    },
  });

  const fakeUsers = [] as {
    id?: number;
    firstName: string;
    lastName: string;
    email: string;
    dni: string;
    phone: string;
    address?: string | null;
    password: string;
    role?: UserRole;
    createdAt?: Date | string;
    activeOrdersCount?: number | null;
  }[];

  const Roles = [UserRole.CHEF, UserRole.HOST, UserRole.WAITER];

  for (let index = 0; index < 20; index++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();

    const role = Roles[faker.number.int({ min: 0, max: 2 })]!;

    fakeUsers.push({
      firstName,
      lastName,
      dni: faker.number.int({ min: 70000000, max: 79999999 }).toString(),
      email: faker.internet.email({ firstName, lastName }),
      password: hashedPassword,
      phone: "987654321",
      address: faker.location.streetAddress(),
      role,
      activeOrdersCount: role === UserRole.WAITER ? 0 : null,
    });
  }

  await prisma.user.createMany({ data: fakeUsers });

  // Creando Clientes
  await prisma.client.createMany({
    data: [
      {
        firstName: "Juan",
        lastName: "Pérez",
        phone: "987654321",
        email: "juan.perez@cliente.com",
      },
      {
        firstName: "Maria",
        lastName: "Lopez",
        phone: "987654322",
        email: "maria.lopez@cliente.com",
      },
      {
        firstName: "Luis",
        lastName: "Ramirez",
        phone: "987654323",
        email: "luis.ramirez@cliente.com",
      },
      {
        firstName: "Carla",
        lastName: "Gomez",
        phone: "987654324",
        email: "carla.gomez@cliente.com",
      },
      {
        firstName: "Pedro",
        lastName: "Fernandez",
        phone: "987654325",
        email: "pedro.fernandez@cliente.com",
      },
    ],
  });

  const table = await prisma.table.create({
    data: {
      capacity: 4,
      status: "Occupied",
    },
  });

  // Creando un pedido con productos
  const order = await prisma.order.create({
    data: {
      status: "InProcess",
      total: 0, // Será calculado más adelante
      clientId: 1, // Juan Pérez
      waiterId: waiter.id,
      tableId: table.id,
    },
  });

  await prisma.orderProduct.createMany({
    data: [
      {
        quantity: 2,
        unitPrice: 35.0,
        orderId: order.id,
        productId: 1,
      },
      {
        quantity: 1,
        unitPrice: 32.0,
        orderId: order.id,
        productId: 2,
      },
    ],
  });

  // Calculando el total del pedido
  const total = 2 * 35.0 + 1 * 32.0;
  await prisma.order.update({
    where: { id: order.id },
    data: { total },
  });

  const possibleStatuses = [
    TableStatus.Available,
    TableStatus.Occupied,
    TableStatus.Reserved,
  ];

  // Creamos 30 mesas
  for (let i = 1; i <= 30; i++) {
    // Generamos una capacidad aleatoria entre 2 y 8, por ejemplo
    const capacity = Math.floor(Math.random() * (8 - 2 + 1)) + 2;
    // Seleccionamos un estado aleatorio
    const status =
      possibleStatuses[Math.floor(Math.random() * possibleStatuses.length)]!;

    await prisma.table.create({
      data: {
        capacity,
        status,
      },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    void prisma.$disconnect();
  });
