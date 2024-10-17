import { PrismaClient } from "@prisma/client";
import { hash } from "@node-rs/argon2";

const prisma = new PrismaClient();

async function main() {
  // Hashed password para usuarios (mozos y administradores)
  const hashedPassword = await hash("password123");

  // Creando Secciones
  const section1 = await prisma.section.create({
    data: { name: "Platos Criollos" },
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

  // Creando Waiter y Admin, y asociándolos a User
  const waiter = await prisma.waiter.create({
    data: {
      firstName: "Carlos",
      lastName: "Lopez",
      email: "carlos.lopez@restaurante.com",
      phone: "987654321",
      address: "Av. Principal 123",
    },
  });

  await prisma.user.create({
    data: {
      password: hashedPassword,
      role: "WAITER",
      relatedId: waiter.id, // ID de la tabla Waiter
    },
  });

  const admin = await prisma.admin.create({
    data: {
      firstName: "Ana",
      lastName: "Martinez",
      email: "ana.martinez@restaurante.com",
      phone: "998877665",
      address: "Jr. Secundaria 456",
    },
  });

  await prisma.user.create({
    data: {
      password: hashedPassword,
      role: "ADMIN",
      relatedId: admin.id, // ID de la tabla Admin
    },
  });

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
      status: "Available",
    },
  });

  // Creando un pedido con productos
  const order = await prisma.order.create({
    data: {
      status: "InProcess",
      total: 0, // Será calculado más adelante
      paymentMethod: "Efectivo",
      clientId: 1, // Juan Pérez
      waiterId: waiter.id,
      tableId: table.id,
    },
  });

  // Creando los elementos del pedido (OrderItems)
  await prisma.orderItem.createMany({
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
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    void prisma.$disconnect();
  });
