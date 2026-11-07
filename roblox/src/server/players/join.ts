import { LocalizationService, PolicyService } from "@rbxts/services";
import { Logger } from "shared/logger";
import { apiPost } from "../api/client";

const log = new Logger("players");

interface JoinResult {
	id: number;
	isNew: boolean;
}

export function joinPlayer(player: Player) {
	const [regionOk, region] = pcall(() => LocalizationService.GetCountryRegionForPlayerAsync(player));
	const [policyOk, policy] = pcall(() => PolicyService.GetPolicyInfoForPlayerAsync(player));

	const result = apiPost<JoinResult>("/game/players/join", {
		userId: player.UserId,
		username: player.Name,
		displayName: player.DisplayName,
		accountAgeDays: player.AccountAge,
		region: regionOk ? region : undefined,
		policyFlags: policyOk
			? {
					AreAdsAllowed: policy.AreAdsAllowed,
					ArePaidRandomItemsRestricted: policy.ArePaidRandomItemsRestricted,
					IsPaidItemTradingAllowed: policy.IsPaidItemTradingAllowed,
					IsSubjectToChinaPolicies: policy.IsSubjectToChinaPolicies,
			  }
			: undefined,
	});

	if (result.data === undefined) {
		log.warn(`${player.Name} failed to join (status ${result.status})`);
		return;
	}
	log.info(`${player.Name} -> id ${result.data.id}, isNew ${result.data.isNew}`);
}
