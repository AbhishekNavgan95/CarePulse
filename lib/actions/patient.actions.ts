"use server"

import { ID, Query } from "node-appwrite";
import { databases, users, storage } from "../appwrite.config";
import { parseStringify } from "../utils";
import { InputFile } from "node-appwrite/file";

export const createUser = async (user: CreateUserParams) => {
    try {
        const newUser = await users.create(
            ID.unique(),
            user?.email,
            user?.phone,
            undefined,
            user?.name
        );

        return parseStringify(newUser);
    } catch (error: any) {
        if (error && error?.code === 409) {
            console.log("User already exists");
            const documents = await users.list([
                Query.equal("email", user.email)
            ]);

            return documents?.users[0];
        }
        console.log("error : ", error);
    }
};

export const getUser = async (userId: string) => {
    try {
        const user = await users.get(userId);

        return parseStringify(user);
    } catch (error) {
        console.log("error");
    }
};

export const getPatient = async (userId: string) => {
    try {
        const patients = await databases.listDocuments(
            process.env.DATABASE_ID!,
            process.env.PATIENT_COLLECTION_ID!,
            [
                Query.equal("userId", userId)
            ]
        )

        return parseStringify(patients.documents[0]);
    } catch (error) {
        console.log("error : ", error);
    }
};

export const registerPatient = async ({ identificationDocument, ...patient }: RegisterUserParams) => {
    try {
        let file;

        if (identificationDocument) {

            const blobFile = identificationDocument?.get('blobFile') as Blob;
            const fileName = identificationDocument?.get('fileName') as string;

            if (blobFile && fileName) {
                const arrayBuffer = await blobFile.arrayBuffer();
                const buffer = Buffer.from(arrayBuffer);
                const inputFile = InputFile.fromBuffer(buffer, fileName);


                file = await storage.createFile(process.env.BUCKET_ID!, ID.unique(), inputFile);
            } else {
                console.error("blobFile or fileName is missing");
            }
        }

        const identificationDocumentId = file?.$id || null;
        const identificationDocumentUrl = file
            ? `${process.env.NEXT_PUBLIC_ENDPOINT}/storage/buckets/${process.env.BUCKET_ID}/files/${file?.$id}/view?project=${process.env.PROJECT_ID}`
            : null;

        const newPatient = await databases.createDocument(
            process.env.DATABASE_ID!,
            process.env.PATIENT_COLLECTION_ID!,
            ID.unique(),
            {
                identificationDocumentId,
                identificationDocumentUrl,
                ...patient
            }
        );

        return parseStringify(newPatient);
    } catch (error) {
        console.log("error while registering patient: ", error);
    }
};
