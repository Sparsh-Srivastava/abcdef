import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Assets } from "../../constants";
import { Post } from "../../shared/models";
import { fileUpload } from "../../shared/services/fileUpload";
import { MdClose } from "react-icons/md";
import "./Home.scss";
import { APIService } from "../../shared/services/apiService";
import { Navbar } from "../../shared/components";

const Home = () => {
	const [selectedFile, setSelectedFile] = useState();
	const [preview, setPreview] = useState<undefined | string>();
	const [tag, setTag] = useState<string>("");
	const [post, setPost] = useState<Post>({
		title: "",
		description: "",
		tags: [],
		file_name: "",
		redirect_url: "",
	});

	useEffect(() => {
		if (!selectedFile) {
			setPreview(Assets.IMG_UPLOAD);
			return;
		}
		const objectUrl = URL.createObjectURL(selectedFile);
		setPreview(objectUrl);
		console.log(objectUrl);
		return () => URL.revokeObjectURL(objectUrl);
	}, [selectedFile]);

	const addTag = () => {
		setPost({ ...post, tags: [...post.tags, tag] });
		setTag("");
	};

	const deleteTag = (position: number) => {
		let tempTags = [...post.tags];
		tempTags.splice(position, 1);
		setPost({ ...post, tags: tempTags });
	};

	const onSelectFile = async (e: any) => {
		try {
			if (!e.target || !e.target.files || e.target.files.length === 0) {
				setSelectedFile(undefined);
				return;
			}
			setSelectedFile(e.target.files[0]);
			const formData = new FormData();
			formData.append("dp", e.target.files[0], e.target.files[0].name);
			for (var pair of formData.entries()) {
				console.log(pair[0] + ", " + pair[1]);
			}
			const file_name = await fileUpload(formData);
			setPost({ ...post, file_name: file_name });
		} catch (error) {
			toast.error(error.response?.data.message || "Unable to upload Ad");
			console.log(error);
		}
	};

	const createPost = async () => {
		try {
			await APIService.getInstance().createPost(post);
			toast.success("Ad is posted successfully");
		} catch (error) {
			toast.error(error.response?.data.message || "Failed to create Post");
		}
	};

	return (
		<section className="srm-home">
			<Navbar />
			<h2>Create New Ad</h2>
			<form>
				<main className="upload-section">
					<div className="upload">
						<div>
							<label htmlFor="fileUpload">Upload Ad Image here</label>
							<button>
								<input
									type="file"
									name="ad-img"
									onChange={onSelectFile}
									accept="image/*"
									id="fileUpload"
									required
								/>
							</button>
						</div>
						<div>
							<label htmlFor="title">Add title here</label>
							<input
								type="text"
								name="title"
								id="title"
								value={post.title}
								onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
									setPost({ ...post, title: e.target.value });
								}}
								required
							/>
						</div>
						<div>
							<label htmlFor="tags">Add tags here</label>
							<div className="add-tags">
								<input
									type="text"
									name="tags"
									value={tag}
									onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
										setTag(e.target.value);
									}}
									id="tags"
								/>
								<button type="button" onClick={addTag}>
									Add
								</button>
							</div>
							<div className="preview-tags">
								{post.tags.map((tag, index) => (
									<div key={index}>
										<span>{tag}</span>
										<MdClose
											onClick={() => {
												deleteTag(index);
											}}
										/>
									</div>
								))}
							</div>
						</div>
						<div>
							<label htmlFor="description">Add description here</label>
							<textarea
								name="description"
								id="description"
								value={post.description}
								rows={4}
								onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
									setPost({ ...post, description: e.target.value });
								}}
								required
							></textarea>
						</div>
						<div>
							<label htmlFor="redirect_url">Add URL here</label>
							<input
								type="text"
								name="redirect_url"
								id="redirect_url"
								value={post.redirect_url}
								onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
									setPost({ ...post, redirect_url: e.target.value });
								}}
								required
							/>
						</div>
					</div>
					<div className="preview">
						<img src={preview} alt="Update Ads" />
					</div>
				</main>
				<button
					className="post-submit"
					type="submit"
					onClick={(e) => {
						e.preventDefault();
						createPost();
					}}
				>
					Create Post
				</button>
			</form>
		</section>
	);
};
export default Home;
