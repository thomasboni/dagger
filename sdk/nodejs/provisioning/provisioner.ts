import { EngineConn } from "./engineconn.js"
import { DockerImage } from "./docker-provision/image.js"
import { HTTP } from "./http/http.js"
import { Bin } from "./bin/bin.js"

type ProvisionerFunc = (u: URL) => EngineConn

const provisioners: Record<string, ProvisionerFunc> = {
  "docker-image": (u: URL) => new DockerImage(u),
  http: (u: URL) => new HTTP(u),
  bin: (u: URL) => new Bin(u),
}

/**
 * getProvisioner returns a ready to use Engine connector.
 * This method parse the given host to find out which kind
 * of provisioner shall be returned.
 *
 * It supports the following provisioners:
 * - docker-image
 */
export function getProvisioner(host: string): EngineConn {
  const url = new URL(host)

  // Use slice(0, -1) to remove the extra : from the protocol
  // For instance http: -> http
  const provisioner = provisioners[url.protocol.slice(0, -1)]
  if (!provisioner) {
    throw new Error(`invalid dagger host: ${host}.`)
  }

  return provisioner(url)
}
