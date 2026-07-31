import { Server, ShieldCheck, Zap } from "lucide-react";
import type React from "react";
import { STREAM_SERVERS } from "../services/servers";
import type { StreamServer } from "../types";

interface ServerSelectorProps {
	currentServerId: string;
	onSelectServer: (server: StreamServer) => void;
}

export const ServerSelector: React.FC<ServerSelectorProps> = ({
	currentServerId,
	onSelectServer,
}) => {
	return (
		<div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-3 sm:p-3.5 my-3 backdrop-blur-md">
			<div className="flex items-center justify-between mb-2.5 flex-wrap gap-2">
				<div className="flex items-center gap-2">
					<Server className="w-4 h-4 text-amber-400" />
					<span className="text-xs font-bold text-white tracking-wider">
						سێرڤەرەکانی پەخشکردن
					</span>
				</div>
				<div className="flex items-center gap-1 text-[11px] text-zinc-400">
					<Zap className="w-3 h-3 text-amber-400" />
					<span>ئەگەر ڤیدیۆکە کاری نەکرد سێرڤەرێکی تر هەڵبژێرە</span>
				</div>
			</div>

			<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
				{STREAM_SERVERS.map((server) => {
					const isActive = server.id === currentServerId;
					return (
						<button
							type="button"
							key={server.id}
							onClick={() => onSelectServer(server)}
							className={`p-2.5 rounded-xl text-xs font-bold flex items-center justify-between transition-all border ${
								isActive
									? "bg-amber-400 text-zinc-950 border-amber-300 shadow-md shadow-amber-400/20 scale-[1.02]"
									: "bg-zinc-950/80 hover:bg-zinc-800 text-zinc-300 border-zinc-800"
							}`}
						>
							<span className="truncate">{server.name}</span>
							{isActive && (
								<ShieldCheck className="w-3.5 h-3.5 text-zinc-950 mr-1 shrink-0" />
							)}
						</button>
					);
				})}
			</div>
		</div>
	);
};
