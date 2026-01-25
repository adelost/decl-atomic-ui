import type { Page } from 'svelte-daui';
import { missionStore } from '../../stores/mission.svelte';

/**
 * Mission Control - Space Station Command
 */
export const missionPage: Page = {
  layout: 'full',
  title: 'Mission Control',
  sections: [
    {
      molecule: 'page-header',
      title: () => missionStore.missionName,
      subtitle: () => `Day ${missionStore.missionDay} • Destination: ${missionStore.destination}`,
      badge: {
        atom: 'badge',
        text: () => missionStore.overallStatus.toUpperCase(),
        color: () => missionStore.getStatusBadgeColor(missionStore.overallStatus),
      },
      actions: [
        {
          atom: 'button',
          text: () => (missionStore.isPolling ? 'Stop Monitoring' : 'Start Monitoring'),
          variant: () => (missionStore.isPolling ? 'secondary' : 'primary'),
          onClick: () => {
            if (missionStore.isPolling) {
              missionStore.stopPolling();
            } else {
              missionStore.startPolling();
              const interval = setInterval(() => {
                if (!missionStore.isPolling) {
                  clearInterval(interval);
                  return;
                }
                missionStore.simulateUpdate();
              }, 3000);
            }
          },
        },
      ],
    },
    {
      molecule: 'grid',
      columns: 3,
      gap: 'md',
      padding: 'md',
      items: [
        {
          molecule: 'stat-card',
          title: 'Oxygen',
          value: () => `${Math.round(missionStore.systems.oxygen.level)}%`,
          icon: 'wind',
        },
        {
          molecule: 'stat-card',
          title: 'Fuel Reserves',
          value: () => `${Math.round(missionStore.systems.fuel.level)}%`,
          icon: 'fuel',
        },
        {
          molecule: 'stat-card',
          title: 'Power Output',
          value: () => `${Math.round(missionStore.systems.power.level)} MW`,
          icon: 'zap',
        },
        {
          molecule: 'stat-card',
          title: 'Hull Integrity',
          value: () => `${Math.round(missionStore.systems.hull.level)}%`,
          icon: 'shield',
        },
        {
          molecule: 'stat-card',
          title: 'Communications',
          value: () => `${Math.round(missionStore.systems.comms.level)}%`,
          icon: 'radio',
        },
        {
          molecule: 'stat-card',
          title: 'Life Support',
          value: () => `${Math.round(missionStore.systems.life_support.level)}%`,
          icon: 'heart',
        },
      ],
    },
    {
      molecule: 'grid',
      columns: 2,
      gap: 'md',
      padding: 'md',
      items: [
        {
          organism: 'card',
          header: { atom: 'text', variant: 'heading', text: 'Power Telemetry' },
          content: [
            {
              atom: 'chart',
              id: 'power-telemetry',
              type: 'area',
              data: () => missionStore.powerHistory,
              height: 150,
              color: 'hsl(var(--chart-1))',
              showGrid: true,
              showLabels: true,
            },
          ],
        },
        {
          organism: 'card',
          header: { atom: 'text', variant: 'heading', text: 'Oxygen Telemetry' },
          content: [
            {
              atom: 'chart',
              id: 'oxygen-telemetry',
              type: 'line',
              data: () => missionStore.oxygenHistory,
              height: 150,
              color: 'hsl(var(--chart-2))',
              showGrid: true,
              showLabels: true,
            },
          ],
        },
        {
          organism: 'card',
          header: {
            molecule: 'stack',
            direction: 'horizontal',
            justify: 'between',
            align: 'center',
            items: [
              { atom: 'text', variant: 'heading', text: 'Crew Roster' },
              {
                molecule: 'stack',
                direction: 'horizontal',
                gap: 'sm',
                items: [
                  { atom: 'badge', text: () => `${missionStore.activeCrew} Active`, color: 'green' },
                  {
                    atom: 'badge',
                    text: () => `${missionStore.crewOnEva} EVA`,
                    color: 'yellow',
                    visible: () => missionStore.crewOnEva > 0,
                  },
                ],
              },
            ],
          },
          content: [
            {
              molecule: 'list',
              id: 'crew-roster',
              items: () =>
                missionStore.crew.map((member) => ({
                  key: member.id,
                  leading: {
                    atom: 'badge',
                    text: member.status.toUpperCase(),
                    color: missionStore.getCrewStatusBadgeColor(member.status),
                  },
                  content: {
                    molecule: 'stack',
                    direction: 'vertical',
                    gap: 'none',
                    items: [
                      { atom: 'text', text: member.name },
                      { atom: 'text', text: `${member.role} • ${member.location}`, variant: 'muted' },
                    ],
                  },
                  trailing: {
                    molecule: 'stack',
                    direction: 'vertical',
                    gap: 'none',
                    align: 'end',
                    items: [
                      { atom: 'text', text: `${member.vitals.heartRate} BPM`, variant: 'muted' },
                      { atom: 'text', text: `O2: ${member.vitals.oxygen}%`, variant: 'muted' },
                    ],
                  },
                  data: member,
                })),
              emptyText: 'No crew data available',
            },
          ],
        },
        {
          organism: 'card',
          header: {
            molecule: 'stack',
            direction: 'horizontal',
            justify: 'between',
            align: 'center',
            items: [
              {
                molecule: 'stack',
                direction: 'horizontal',
                gap: 'sm',
                align: 'center',
                items: [
                  { atom: 'text', variant: 'heading', text: 'System Alerts' },
                  {
                    atom: 'badge',
                    text: () => `${missionStore.activeAlerts.length} Active`,
                    color: () => (missionStore.activeAlerts.length > 0 ? 'yellow' : 'green'),
                  },
                ],
              },
              {
                atom: 'button',
                text: 'Acknowledge All',
                variant: 'ghost',
                onClick: () => missionStore.acknowledgeAllAlerts(),
                visible: () => missionStore.activeAlerts.length > 0,
              },
            ],
          },
          content: [
            {
              molecule: 'list',
              id: 'alerts-list',
              items: () =>
                missionStore.alerts.slice(0, 5).map((alert) => ({
                  key: alert.id,
                  leading: {
                    atom: 'badge',
                    text: alert.type.toUpperCase(),
                    color: alert.type === 'error' ? 'red' : alert.type === 'warning' ? 'yellow' : 'blue',
                  },
                  content: {
                    molecule: 'stack',
                    direction: 'vertical',
                    gap: 'none',
                    items: [
                      {
                        molecule: 'stack',
                        direction: 'horizontal',
                        gap: 'sm',
                        items: [
                          { atom: 'text', text: alert.system },
                          ...(alert.acknowledged
                            ? [{ atom: 'badge' as const, text: 'ACK', color: 'gray' as const }]
                            : []),
                        ],
                      },
                      { atom: 'text', text: alert.message, variant: 'muted' },
                      { atom: 'text', text: missionStore.formatTimestamp(alert.timestamp), variant: 'small' },
                    ],
                  },
                  trailing: {
                    atom: 'button',
                    text: 'ACK',
                    variant: 'ghost',
                    onClick: () => missionStore.acknowledgeAlert(alert.id),
                    visible: () => !alert.acknowledged,
                  },
                  data: alert,
                })),
              emptyText: 'All systems nominal. No alerts.',
            },
          ],
        },
      ],
    },
  ],
};
