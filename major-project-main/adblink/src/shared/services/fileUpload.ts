import { toast } from "react-toastify";
import { APIService } from "./apiService";

export const fileUpload = async (fileData: any) => {
	try {
		const {
			data: { file_name },
		} = await APIService.getInstance().postFileUpload(fileData);
		return file_name;
	} catch (error) {
		toast.error(error.response?.data.message || "File Upload Error");
		console.log(error);
	}
};
