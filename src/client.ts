import { SolverApi } from "./generated/apis/SolverApi";
import { Configuration } from "./generated/runtime";
import type { ActionEnvelope } from "./generated/models/ActionEnvelope";
import type { ExecutionMeta } from "./generated/models/ExecutionMeta";
import type { HealthResponse } from "./generated/models/HealthResponse";
import type { RestartEnvelope } from "./generated/models/RestartEnvelope";
import type { SubmitEnvelope } from "./generated/models/SubmitEnvelope";

export type RequestMeta = Pick<
  ExecutionMeta,
  "model" | "promptTokens" | "completionTokens"
>;

export interface ClientOptions {
  apiToken: string;
  baseUrl: string;
  fetchApi?: typeof fetch;
}

export class Client {
  private readonly api: SolverApi;

  constructor(options: ClientOptions) {
    const basePath = normalizeBaseUrl(options.baseUrl);
    this.api = new SolverApi(
      new Configuration({
        basePath,
        accessToken: options.apiToken,
        fetchApi: options.fetchApi,
      }),
    );
  }

  health(): Promise<HealthResponse> {
    return this.api.getHealth();
  }

  taskAction(input: {
    taskId: string;
    action: string;
    payload?: Record<string, unknown>;
    meta?: RequestMeta;
  }): Promise<ActionEnvelope> {
    return this.api.taskAction({
      taskID: input.taskId,
      action: input.action,
      actionRequest: {
        params: input.payload ?? {},
        meta: input.meta,
      },
    });
  }

  submitTask(input: {
    taskId: string;
    answer: unknown;
    meta?: RequestMeta;
  }): Promise<SubmitEnvelope> {
    return this.api.submitTask({
      taskID: input.taskId,
      submitRequest: {
        params: {
          answer: input.answer,
        },
        meta: input.meta,
      },
    });
  }

  restartTask(taskId: string): Promise<RestartEnvelope> {
    return this.api.restartTask({ taskID: taskId });
  }

  trackTaskAction(input: {
    trackId: string;
    taskId: string;
    action: string;
    payload?: Record<string, unknown>;
    meta?: RequestMeta;
  }): Promise<ActionEnvelope> {
    return this.api.trackTaskAction({
      trackID: input.trackId,
      taskID: input.taskId,
      action: input.action,
      actionRequest: {
        params: input.payload ?? {},
        meta: input.meta,
      },
    });
  }

  submitTrackTask(input: {
    trackId: string;
    taskId: string;
    answer: unknown;
    meta?: RequestMeta;
  }): Promise<SubmitEnvelope> {
    return this.api.submitTrackTask({
      trackID: input.trackId,
      taskID: input.taskId,
      submitRequest: {
        params: {
          answer: input.answer,
        },
        meta: input.meta,
      },
    });
  }

  restartTrack(trackId: string): Promise<RestartEnvelope> {
    return this.api.restartTrack({ trackID: trackId });
  }
}

function normalizeBaseUrl(baseUrl: string): string {
  const trimmed = baseUrl.replace(/\/+$/, "");
  if (trimmed.endsWith("/api/agent")) {
    return trimmed;
  }
  return `${trimmed}/api/agent`;
}
