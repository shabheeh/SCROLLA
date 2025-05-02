import { useState } from "react";
import { X, AlertTriangle } from "lucide-react";
import { deleteArticle } from "../services/article.service";
import { IArticle } from "../types/article.types";

type DeleteArticleModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  article: IArticle;
};

const DeleteArticleModal: React.FC<DeleteArticleModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  article,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setIsDeleting(true);
    await deleteArticle(article._id)
    onConfirm();
    setIsDeleting(false);
    onClose();
  };

  const truncatedTitle =
    article.title.length > 40
      ? `${article.title.substring(0, 40)}...`
      : article.title;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div
        className="w-full max-w-md bg-white p-6 rounded-xl shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-full">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <h2 className="text-xl font-bold">Delete Article</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full cursor-pointer hover:bg-secondary/50 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-6">
          <p className="mb-4">
            Are you sure you want to delete the article{" "}
            <span className="font-medium">"{truncatedTitle}"</span>?
          </p>
          <p className="text-sm text-muted-foreground">
            This action cannot be undone. The article will be permanently
            removed from our servers.
          </p>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-secondary/20 cursor-pointer rounded-lg hover:bg-secondary/40 transition-colors"
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className={`px-4 py-2 bg-red-500 cursor-pointer text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2 ${
              isDeleting ? "opacity-70 cursor-not-allowed" : ""
            }`}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete Article"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteArticleModal;
