"use server";
import { prisma } from "./prisma";
import { auth } from "@clerk/nextjs/server";
import { UploadResponse } from "imagekit/dist/libs/interfaces";
import { imagekit } from "./utils";
import {z}from "zod";
import { revalidatePath } from "next/cache";
export const followUser = async (targetUserId: string) => {
  const { userId } = await auth();

  if (!userId) return;

  const existingUser = await prisma.follow.findFirst({
    where: {
      followerId: userId,
      followingId: targetUserId,
    },
  });
  if (existingUser) {
    await prisma.follow.delete({
      where: {
        id: existingUser.id,
      },
    });
  } else {
    await prisma.follow.create({
      data: {
        followerId: userId,
        followingId: targetUserId,
      },
    });
  }
};

export const likePost = async (postId: number) => {
  const { userId } = await auth();
  if (!userId) return;

  const isliked = await prisma.like.findFirst({
    where: {
      userId: userId,
      postId: postId,
    },
  });
  if (isliked) {
    await prisma.like.delete({
      where: {
        id: isliked.id,
      },
    });
  } else {
    await prisma.like.create({
      data: {
        userId,
        postId,
      },
    });
  }
};

export const rePost = async (postId: number) => {
  const { userId } = await auth();

  if (!userId) return;

  const existingRePost = await prisma.post.findFirst({
    where: {
      userId: userId,
      rePostId: postId,
    },
  });

  if (existingRePost) {
    await prisma.post.delete({
      where: { id: existingRePost.id },
    });
  } else {
    await prisma.post.create({
      data: { userId, rePostId: postId },
    });
  }
};
export const savePost = async (postId: number) => {
  const { userId } = await auth();

  if (!userId) return;

  const existingSavedPost = await prisma.savedPosts.findFirst({
    where: {
      userId: userId,
      postId: postId,
    },
  });

  if (existingSavedPost) {
    await prisma.savedPosts.delete({
      where: { id: existingSavedPost.id },
    });
  } else {
    await prisma.savedPosts.create({
      data: { userId, postId },
    });
  }
};
export const addPost = async (
  prevState: { success: boolean; error: boolean },
  formData: FormData
) => {
  const { userId } = await auth();

  if (!userId) return { success: false, error: true };

  const desc = formData.get("desc");
  const file = formData.get("file") as File;
  const isSensitive = formData.get("isSensitive") as string;
  const imgType = formData.get("imgType");

  const uploadFile = async (file: File): Promise<UploadResponse> => {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const transformation = `w-600,${
      imgType === "square" ? "ar-1-1" : imgType === "wide" ? "ar-16-9" : ""
    }`;

    return new Promise((resolve, reject) => {
      imagekit.upload(
        {
          file: buffer,
          fileName: file.name,
          folder: "/posts",
          ...(file.type.includes("image") && {
            transformation: {
              pre: transformation,
            },
          }),
        },
        function (error, result) {
          if (error) reject(error);
          else resolve(result as UploadResponse);
        }
      );
    });
  };

  const Post = z.object({
    desc: z.string().max(140),
    isSensitive: z.boolean().optional(),
  });

  const validatedFields = Post.safeParse({
    desc,
    isSensitive: JSON.parse(isSensitive),
  });

  if (!validatedFields.success) {
    console.log(validatedFields.error.flatten().fieldErrors);
    return { success: false, error: true };
  }

  let img = "";
  let imgHeight = 0;
  let video = "";

  if (file.size) {
    const result: UploadResponse = await uploadFile(file);

    if (result.fileType === "image") {
      img = result.filePath;
      imgHeight = result.height;
    } else {
      video = result.filePath;
    }
  }

  console.log({
    ...validatedFields.data,
    userId,
    img,
    imgHeight,
    video,
  });

  try {
    await prisma.post.create({
      data: {
        ...validatedFields.data,
        userId,
        img,
        imgHeight,
        video,
      },
    });
    revalidatePath(`/`);
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
  return { success: false, error: true };
};