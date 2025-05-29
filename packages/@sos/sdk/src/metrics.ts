import opentelemetry, { type Attributes } from '@opentelemetry/api';
import type { Context } from './types';

const baseAttributes = <K>(context: Context<K>) =>
  ({
    version: context.api.version,
    kind: context.api.kind,
    serviceName: context.serviceName,
    handlerName: context.handlerName,
  }) as Attributes;

export const createCounter = <K>(context: Context<K>, counterName?: string) => {
  const meter = opentelemetry.metrics.getMeter(context.handlerName, context.api.version);
  const metricName = counterName || context.handlerName;
  const counter = meter.createCounter(metricName, {
    description: `Counter for ${metricName}`,
  });
  return {
    add: (value: number, attributes: Attributes | Record<string, unknown>) => {
      counter.add(value, {
        ...(attributes as Attributes),
        ...baseAttributes(context),
      });
    },
  };
};

export const createTimer = <K>(context: Context<K>, timerName?: string) => {
  const meter = opentelemetry.metrics.getMeter(context.handlerName, context.api.version);
  const metricName = timerName || `${context.handlerName}-ms`;
  const timer = meter.createHistogram(metricName, {
    description: `Duration of ${metricName}`,
    unit: 'ms',
  });
  return {
    record: (duration: number, attributes: Attributes | Record<string, unknown>) => {
      timer.record(duration, {
        ...(attributes as Attributes),
        ...baseAttributes(context),
      });
    },
  };
};
