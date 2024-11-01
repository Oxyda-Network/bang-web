import { useEffect, useRef, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;

interface PDFViewerProps {
    file: string;
    onClose: () => void;
}

export default function PDFViewer({ file, onClose }: PDFViewerProps) {
    const viewerRef = useRef<HTMLDivElement>(null);
    const [numPages, setNumPages] = useState<number | null>(null);
    const [pageNumber, setPageNumber] = useState(1);

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

    function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
        setNumPages(numPages);
    }

    function changePage(offset: number) {
        setPageNumber(prevPageNumber => prevPageNumber + offset);
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div ref={viewerRef} className="bg-white p-4 rounded-lg shadow-lg max-w-7xl w-full w-11/12 h-5/6 overflow-auto">
                <button onClick={onClose} className="text-black-500 hover:text-black-700 mb-4">
                    Close
                </button>
                <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
                    <Page pageNumber={pageNumber} width={1000}/>
                </Document>
                <div className="flex justify-between mt-4">
                    <button
                        type="button"
                        disabled={pageNumber <= 1}
                        onClick={() => changePage(-1)}
                        className="text-black-500 hover:text-black-700"
                    >
                        Previous
                    </button>
                    <p>
                        Page {pageNumber} of {numPages}
                    </p>
                    <button
                        type="button"
                        disabled={pageNumber >= (numPages || 0)}
                        onClick={() => changePage(1)}
                        className="text-black-500 hover:text-black-700"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}