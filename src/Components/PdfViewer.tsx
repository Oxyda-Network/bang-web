import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';

interface PdfViewerProps {
    fileUrl: string;
    onClose: () => void;
}

const PdfViewer: React.FC<PdfViewerProps> = ({ fileUrl, onClose }) => {
    return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-4 rounded-lg shadow-lg w-3/4 h-3/4 relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-600 hover:text-gray-900">
            Close
        </button>
        <Worker workerUrl={`https://cdn.jsdelivr.net/npm/pdfjs-dist@3.7.107/build/pdf.min.js`}>
            <Viewer fileUrl={fileUrl} />
        </Worker>
        </div>
    </div>
    );
};

export default PdfViewer;