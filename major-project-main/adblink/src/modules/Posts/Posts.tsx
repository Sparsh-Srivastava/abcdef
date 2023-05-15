import React, { useState } from "react";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { Post } from "../../shared/models";
import { APIService } from "../../shared/services/apiService";

const Posts = () => {
	const [posts, setPosts] = useState<Post[]>();
	useEffect(() => {
		(async () => {
			try {
				const {
					data: { posts },
				} = await APIService.getInstance().getPosts();
				setPosts(posts);
			} catch (error) {
				toast.error(error.response?.data.message || "Unable to fetch Posts");
			}
		})();
	}, []);
	return (
		<section className="srm-posts">
			{posts?.map((post: Post, index: number) => (
				<div key={index}>
					<div className="post-img">
						<img src={post.file_name} alt={post.file_name} />
					</div>
					<div className="post-content"></div>
				</div>
			))}
		</section>
	);
};

export default Posts;
