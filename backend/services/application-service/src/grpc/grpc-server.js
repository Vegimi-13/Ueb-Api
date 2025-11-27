import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import path from "path";
import { fileURLToPath } from "url";

import { ApplicationServer } from "./application.server.js";
import { HealthServer } from "./health.server.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROTO_PATHS = [
  path.resolve(__dirname, "../../../proto/application.proto"),
  path.resolve(__dirname, "../../../proto/health.proto"),
];

const packageDefs = protoLoader.loadSync(PROTO_PATHS, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const proto = grpc.loadPackageDefinition(packageDefs);

const server = new grpc.Server();

server.addService(proto.application.ApplicationService.service, ApplicationServer);
server.addService(proto.grpc.health.v1.Health.service, HealthServer);

const PORT = process.env.GRPC_PORT || 50053;

server.bindAsync(
  `0.0.0.0:${PORT}`,
  grpc.ServerCredentials.createInsecure(),
  () => {
    console.log(`🚀 Application gRPC running on port ${PORT}`);
  }
);
