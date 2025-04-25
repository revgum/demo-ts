import type { Context } from '@/types';
import opentelemetry from '@opentelemetry/api';

const baseAttributes = (context: Context) => ({
  version: context.api.version,
  kind: context.api.kind,
});

export const createCounter = (context: Context, handlerName: string, counterName: string) => {
  const meter = opentelemetry.metrics.getMeter(handlerName, context.api.version);
  const counter = meter.createCounter(counterName, {
    description: `Counter for ${counterName}`,
  });
  return {
    add: (value: number, attributes: Record<string, unknown>) => {
      counter.add(value, {
        ...attributes,
        ...baseAttributes(context),
      });
    },
  };
};

export const createTimer = (context: Context, handlerName: string, timerName: string) => {
  const meter = opentelemetry.metrics.getMeter(handlerName, context.api.version);
  const timer = meter.createHistogram(timerName, {
    description: `Duration of ${timerName}`,
    unit: 'ms',
  });
  return {
    record: (duration: number, attributes: Record<string, unknown>) => {
      timer.record(duration, {
        ...attributes,
        ...baseAttributes(context),
      });
    },
  };
};
