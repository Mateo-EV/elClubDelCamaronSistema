import { db } from "@/server/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { persons, date, firstName, lastName, phone, email } =
      await req.json();

    // Validar los datos del cuerpo de la solicitud
    if (!persons || !date || !firstName || !lastName || !phone || !email) {
      return NextResponse.json(
        { error: "Todos los campos son obligatorios." },
        { status: 400 },
      );
    }

    const client = await db.client.upsert({
      where: { email },
      create: {
        firstName,
        lastName,
        phone,
        email,
      },
      update: {
        firstName,
        lastName,
        phone,
      },
    });

    const scheduledAt = new Date(date as string);

    const availableTable = await db.table.findFirst({
      where: {
        status: "Available",
        capacity: { gte: persons },
      },
      orderBy: { capacity: "asc" },
    });

    if (!availableTable) {
      return NextResponse.json(
        {
          error:
            "No hay mesas disponibles para el número de personas seleccionado.",
        },
        { status: 404 },
      );
    }

    // Crear la reserva
    const reservation = await db.reservation.create({
      data: {
        scheduledAt,
        status: "Pending",
        clientId: client.id,
        tableId: availableTable.id,
      },
    });

    return NextResponse.json({
      message: "Reserva creada exitosamente.",
      reservation,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        error:
          "Hubo un problema al crear la reserva. Intente nuevamente más tarde.",
      },
      { status: 500 },
    );
  }
}
