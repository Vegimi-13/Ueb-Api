import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import path from "path";
import { fileURLToPath } from "url";

import { AuthServer } from "./auth.server.js";
import { HealthServer } from "./health.server.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROTO_PATHS = [
  path.resolve(__dirname, "../../../proto/auth.proto"),
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

server.addService(proto.auth.AuthService.service, AuthServer);
server.addService(proto.grpc.health.v1.Health.service, HealthServer);

const PORT = process.env.GRPC_PORT || 50051;

server.bindAsync(
  `0.0.0.0:${PORT}`,
  grpc.ServerCredentials.createInsecure(),
  () => {
    console.log(`🚀 Auth gRPC running on port ${PORT}`);
  }
);
