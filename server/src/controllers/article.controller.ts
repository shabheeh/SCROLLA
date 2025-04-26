import { Request, Response } from "express"

export const addArticle = async(req: Request, res: Response): Promise<void> => {
    const articleData = req.body;
}