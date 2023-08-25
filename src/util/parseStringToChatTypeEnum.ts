import { ChatType } from "@prisma/client";

const parseStringToChatTypeEnum = (chatType: string) => {
	if (chatType === "GROUP") {
		return ChatType.GROUP;
	} else if (chatType === "DIRECT") {
		return ChatType.DIRECT;
	} else {
		throw new Error("Invalid chat type");
	}
};
export default parseStringToChatTypeEnum;
