"use client";

import {
  appendRegistration,
  deleteRegistration,
  getRegistrations,
} from "@/api/registration";
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
import { TrashIcon } from "lucide-react";
import { useEffect, useState } from "react";

export default function Home() {
  const today = new Date();
  const initialDate = today.toISOString().split("T")[0];

  const [registrations, setRegistrations] = useState<Registration[]>([]);

  useEffect(() => {
    let registrations = getRegistrations();
    registrations
      .then((res) => res.json())
      .then((data) => {
        setRegistrations(data.registrations);
      });
  }, []);

  return (
    <div className="flex items-center flex-col p-4">
      <h1 className="text-center text-3xl font-bold pb-4">Kilometerweter</h1>
      <div className="flex justify-center items-center flex-col w-full gap-2">
        <Input placeholder="Uitleg" type="text" id="text" />
        <Input placeholder="Kilometers" type="number" id="kilometers" />
        <Input type="date" id="date" defaultValue={initialDate} />
        <Button
          className="w-full"
          onClick={() => {
            appendRegistration();
          }}
        >
          Voeg toe
        </Button>
      </div>
      <br />
      <div className="flex flex-col justify-center w-full gap-2">
        <Card className="flex flex-col justify-center w-full h-fit">
          <CardHeader>
            <CardTitle className="text-center">
              Totaal aantal kilometers
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center text-3xl font-bold">
            {registrations.reduce((acc, cur) => acc + cur.kilometers, 0)}
          </CardContent>
        </Card>
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-center">Geschiedenis</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableCell className="text-left">Uitleg</TableCell>
                  <TableCell className="text-left">Kilometers</TableCell>
                  <TableCell className="text-left">Registratiedatum</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {registrations.map((registration) => (
                  <TableRow key={registration.id}>
                    <TableCell className="text-left">
                      {registration.description}
                    </TableCell>
                    <TableCell className="text-left">
                      {registration.kilometers}
                    </TableCell>
                    <TableCell className="text-left w-full">
                      {registration.date
                        .toString()
                        .split("T")[0]
                        .split("-")
                        .reverse()
                        .join("-")}
                    </TableCell>
                    <TableCell className="text-left">
                      <Button
                        className="bg-red-500 text-white hover:bg-red-800"
                        onClick={() =>
                          deleteRegistration(registration.id).then(() => {
                            setRegistrations(
                              registrations.filter(
                                (reg) => reg.id !== registration.id
                              )
                            );
                          })
                        }
                      >
                        <TrashIcon size={24} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
