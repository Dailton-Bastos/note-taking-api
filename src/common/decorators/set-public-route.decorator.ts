import { SetMetadata } from "@nestjs/common"
import { IS_PUBLIC_ROUTER_KEY } from "../constants"

export const SetPublicRoute = () => SetMetadata(IS_PUBLIC_ROUTER_KEY, true)
