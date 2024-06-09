"use client";

import {
  appendRegistration,
  deleteRegistration,
  getRegistrations,
  updateRegistration,
} from "@/api/registration";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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
import { PencilIcon, TrashIcon } from "lucide-react";
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
                    <TableCell className="text-left">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline">
                            <PencilIcon size={24} />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>Bewerkt registratie</DialogTitle>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <Input
                              type="text"
                              id="text"
                              placeholder={registration.description}
                              onChange={(e) => {
                                registration.description = e.target.value;
                              }}
                            />
                            <Input
                              type="number"
                              id="kilometers"
                              placeholder={registration.kilometers.toString()}
                              onChange={(e) => {
                                registration.kilometers = Number(
                                  e.target.value
                                );
                              }}
                            />
                            <Input
                              type="date"
                              id="date"
                              placeholder={
                                new Date(registration.date)
                                  .toISOString()
                                  .split("T")[0]
                              }
                              onChange={(e) => {
                                registration.date = new Date(e.target.value);
                              }}
                            />
                          </div>
                          <DialogFooter>
                            <Button
                              onClick={() => {
                                updateRegistration(registration);
                                window.location.reload();
                              }}
                            >
                              Save changes
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
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
