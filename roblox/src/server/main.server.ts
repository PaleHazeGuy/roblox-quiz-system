import { Players } from "@rbxts/services";
import { joinPlayer } from "./players/join";

Players.PlayerAdded.Connect(joinPlayer);

for (const player of Players.GetPlayers()) {
	task.spawn(joinPlayer, player);
}
