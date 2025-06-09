import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl as awsGetSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from "uuid";
import File from "./file.model.js";
import dotenv from "dotenv";
import CourseModel from "../course/course.model.js";
import LessonModel from "../lesson/lesson.model.js";

dotenv.config();

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const bucketName = process.env.AWS_BUCKET_NAME;

export const uploadFile = async (req, res) => {
  try {
    const courseId = req.body.courseId;
    const lessonId = req.body.lessonId;
    const file = req.file;
    const uploadedBy = req.user.userId;

    const course = await CourseModel.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const lesson = await LessonModel.findById(lessonId);
    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    // const fileExtension = file.originalname.split(".").pop();
    console.log(file.originalname);
    const fileKey = `course-${course.courseCode}-${courseId}/lesson-${lessonId}/${file.originalname}`;

    const params = {
      Bucket: bucketName,
      Key: fileKey,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    await s3.send(new PutObjectCommand(params));

    // Save metadata to MongoDB
    const fileDoc = await File.create({
      fileName: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      path: fileKey,
      uploadedBy,
    });

    const signedUrl = await generateSignedUrl(bucketName, fileKey);

    return res.status(201).json({
      message: "File uploaded successfully",
      file: fileDoc,
      url: signedUrl,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "File upload failed" });
  }
};

export const generateSignedUrl = async (bucket, key) => {
  const command = new GetObjectCommand({ Bucket: bucket, Key: key });
  return awsGetSignedUrl(s3, command, { expiresIn: 3600 }); // 1 hour
};

export const deleteFile = async (req, res) => {
  try {
    const { id } = req.params;
    const requesterId = req.user.userId;

    const fileDoc = await File.findById(id);
    if (!fileDoc) {
      return res.status(404).json({ message: "File not found" });
    }

    if (
      requesterId &&
      fileDoc.uploadedBy.toString() !== requesterId.toString()
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this file" });
    }

    await s3.send(
      new DeleteObjectCommand({
        Bucket: bucketName,
        Key: fileDoc.path,
      })
    );

    await fileDoc.deleteOne();

    return res.status(200).json({ message: "File deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "File deletion failed" });
  }
};

export const getDownloadUrl = async (req, res) => {
  try {
    const { id } = req.params;

    const fileDoc = await File.findById(id);
    if (!fileDoc) {
      return res.status(404).json({ message: "File not found" });
    }
    const signedUrl = await generateSignedUrl(bucketName, fileDoc.path);
    return res.status(200).json({ url: signedUrl });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Failed to get download URL" });
  }
};
