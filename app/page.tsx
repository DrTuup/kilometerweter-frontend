"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableRow,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Registration } from "@/types/registration";
import { useState } from "react";

export default function Home() {
  const today = new Date();
  const initialDate = today.toISOString().split("T")[0];

  const [registrations, setRegistrations] = useState<Registration[]>([]);

  function appendRegistration() {
    setRegistrations((prev) =>
      [
        {
          id: prev.length.toString(),
          text: (document.getElementById("text") as HTMLInputElement).value,
          kilometers: Number(
            (document.getElementById("kilometers") as HTMLInputElement).value
          ),
          date: new Date(
            (document.getElementById("date") as HTMLInputElement).value
          ),
        },
        ...prev,
      ].sort((a, b) => a.date.getTime() - b.date.getTime())
    );
  }

  return (
    <div className="flex items-center flex-col">
      <h1 className="text-center text-5xl font-bold p-5">Kilometerweter</h1>
      <div className="flex justify-center items-center flex-col w-1/3 gap-2">
        <Input placeholder="Uitleg" type="text" id="text" />
        <Input placeholder="Kilometers" type="number" id="kilometers" />
        <Input type="date" id="date" defaultValue={initialDate} />
        <Button className="w-full" onClick={appendRegistration}>
          Voeg toe
        </Button>
      </div>
      <br />
      <div className="flex flex-row justify-center w-full gap-5">
        <Card className="w-1/3">
          <CardHeader>
            <CardTitle className="text-center">Geschiedenis</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableCell className="text-left">Uitleg</TableCell>
                  <TableCell className="text-left">Kilometers</TableCell>
                  <TableCell className="text-left">Datum</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {registrations.map((registration) => (
                  <TableRow key={registration.id}>
                    <TableCell className="text-left">
                      {registration.text}
                    </TableCell>
                    <TableCell className="text-left">
                      {registration.kilometers}
                    </TableCell>
                    <TableCell className="text-left">
                      {registration.date.toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card className="w-1/3">
          <CardHeader>
            <CardTitle className="text-center">
              Totaal aantal kilometers
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center text-4xl font-bold">
            {registrations.reduce((acc, cur) => acc + cur.kilometers, 0)}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
