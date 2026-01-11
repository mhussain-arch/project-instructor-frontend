"use client";

import { useState } from "react";
import { useSession } from "next-auth/react"; 
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  CardAction,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

export interface ScenarioListItem {
  id: number;
  scenario_title: string;
  scenario_description: string;
  scenario_difficulty: "easy" | "medium" | "hard";
  scenario_endpoint: string;
}

export function ScenarioCard({ scenario }: { scenario: ScenarioListItem }) {
  const { data: session } = useSession(); 
  
  const [isButtonLoading, setButtonLoading] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  const startScenario = async () => {
    // Security Check: Ensure user is logged in
    if (!session || !session.accessToken) {
        console.error("User is not authenticated");
        return; 
    }

    setButtonLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/scenarios/${scenario.scenario_endpoint}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session.accessToken}`, 
          },
          body: JSON.stringify({
            cloud: "DO",
            region: "nyc3",
            instance_type: "1gb",
            application: "wordpress",
            app_version: "latest",
          }),
        }
      );

      // Handle 401 specifically (Token expired / Invalid)
      if (res.status === 401) {
          console.error("Unauthorized. Session might have expired.");
          // Optional: Force sign out or redirect
          return;
      }

      const data = await res.json();

      if (data.success === "1") {
        setIsRunning(true);
      } else {
        console.error("Failed to start scenario", data);
      }
    } catch (error) {
      console.error("Network or Server Error:", error);
    } finally {
      setButtonLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{scenario.scenario_title}</CardTitle>
        <CardDescription>{scenario.scenario_description}</CardDescription>
        <CardAction className="capitalize">
          {scenario.scenario_difficulty}
        </CardAction>
      </CardHeader>
      <CardFooter>
        {isRunning ? (
          <Button
            disabled
            variant="secondary"
            className="w-full bg-green-100 text-green-800"
          >
            Running
          </Button>
        ) : isButtonLoading ? (
          <Button disabled variant="outline">
            <Spinner className="mr-2" />
            Starting...
          </Button>
        ) : (
          <Button onClick={startScenario} type="submit">
            Start Scenario
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}