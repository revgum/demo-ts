import type { Context } from '@/lib/shared/types';
import opentelemetry, { type AttributeValue } from '@opentelemetry/api';

const baseAttributes = <K extends AttributeValue>(context: Context<K>) => ({
  version: context.api.version,
  kind: context.api.kind,
});

export const createCounter = <K extends AttributeValue>(
  context: Context<K>,
  handlerName: string,
  counterName: string,
) => {
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

export const createTimer = <K extends AttributeValue>(
  context: Context<K>,
  handlerName: string,
  timerName: string,
) => {
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
