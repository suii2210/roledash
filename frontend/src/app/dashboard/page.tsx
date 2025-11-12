"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  LuShieldCheck,
  LuBell,
  LuUsers,
  LuLayoutDashboard,
  LuBarChart3,
} from "react-icons/lu";

const content = {
  USER: {
    heading: "Track your personal updates",
    metrics: [
      { label: "Completion", value: 68, icon: LuShieldCheck },
      { label: "Feedback score", value: 82, icon: LuBarChart3 },
    ],
  },
  ADMIN: {
    heading: "Coordinate your organization",
    metrics: [
      { label: "Activation", value: 74, icon: LuUsers },
      { label: "Alerts resolved", value: 91, icon: LuBell },
    ],
  },
} as const;

const analyticsCards = [
  {
    label: "Active sessions",
    value: "8",
    sublabel: "last 30 minutes",
    icon: LuLayoutDashboard,
  },
] as const;

const timelineEvents = [
  { label: "Token verified", tag: "Just now" },
  { label: "Role context loaded", tag: "2s ago" },
  { label: "Dashboard accessed", tag: "5s ago" },
] as const;

export default function DashboardPage() {
  const { user, loading, refresh } = useAuth();
  const router = useRouter();

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, router, user]);

  if (loading || !user) {
    return (
      <Card className="rounded-2xl border border-dashed border-zinc-200 bg-white text-center text-zinc-600">
        <CardContent className="py-12">Checking your session...</CardContent>
      </Card>
    );
  }

  const roleContent = content[user.role];

  return (
    <section className="space-y-6">
      <Card className="relative overflow-hidden border-none bg-gradient-to-r from-indigo-600 via-sky-500 to-cyan-500 text-white shadow-xl">
        <CardHeader className="space-y-2">
          <Badge className="w-fit bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-white">
            Authenticated
          </Badge>
          <CardTitle className="text-4xl">Welcome back, {user.name}</CardTitle>
          <CardDescription className="text-indigo-100">
            {roleContent.heading}
          </CardDescription>
          <p className="text-sm font-semibold uppercase tracking-wide text-indigo-100">
            Role · {user.role}
          </p>
        </CardHeader>
      </Card>

      <div className="grid gap-5 lg:grid-cols-3">
        {analyticsCards.map((card) => (
          <Card key={card.label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardDescription>{card.label}</CardDescription>
              <card.icon className="text-zinc-400" size={18} />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold text-zinc-900">
                {card.value}
              </p>
              <p className="text-xs text-zinc-500">{card.sublabel}</p>
            </CardContent>
          </Card>
        ))}
        {roleContent.metrics.map((item) => (
          <Card key={item.label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardDescription>{item.label}</CardDescription>
              <item.icon className="text-zinc-400" size={18} />
            </CardHeader>
            <CardContent>
              <div className="mb-2 flex items-center justify-between text-sm text-zinc-600">
                <span>{item.value}%</span>
                <Badge variant="secondary" className="text-xs">
                  Target 100%
                </Badge>
              </div>
              <Progress value={item.value} />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Timeline</CardTitle>
          <CardDescription>Latest secure events for this session</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {timelineEvents.map((event, index) => (
            <div key={event.label}>
              <div className="flex items-center justify-between text-sm text-zinc-600">
                <span>{event.label}</span>
                <Badge variant="outline">{event.tag}</Badge>
              </div>
              {index < timelineEvents.length - 1 && (
                <Separator className="my-3" />
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </section>
  );
}
