import { useEffect, useRef } from 'react';
import { Document, Page } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';

interface PDFViewerProps {
    file: string;
    onClose: () => void;
}

export default function PDFViewer({ file, onClose }: PDFViewerProps) {
    const viewerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
        if (viewerRef.current && !viewerRef.current.contains(event.target as Node)) {
        onClose();
        }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
        document.removeEventListener('mousedown', handleClickOutside);
    };
    }, [onClose]);

    return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div ref={viewerRef} className="bg-white p-4 rounded-lg shadow-lg max-w-3xl w-full">
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            Close
        </button>
        <Document file={file}>
            <Page pageNumber={1} />
        </Document>
        </div>
    </div>
    );
}