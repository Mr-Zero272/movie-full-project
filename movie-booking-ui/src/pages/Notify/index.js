function Notify() {
    return (
        <div className="py-10 px-5">
            <div className="mb-5">
                <div className="relative flex items-center justify-between gap-4 rounded-lg bg-primary-normal px-4 py-3 text-white shadow-lg">
                    <p className="text-md text-white font-medium">You just cancel a payment?</p>

                    <button
                        aria-label="Close"
                        className="shrink-0 rounded-lg bg-black/10 p-1 transition hover:bg-black/20"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </button>
                </div>
            </div>
            <div className="mb-5">
                <div className="relative flex items-center justify-between gap-4 rounded-lg bg-primary-normal px-4 py-3 text-white shadow-lg">
                    <p className="text-md text-white font-medium">There are new movies are updated!</p>

                    <button
                        aria-label="Close"
                        className="shrink-0 rounded-lg bg-black/10 p-1 transition hover:bg-black/20"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </button>
                </div>
            </div>
            <div className="mb-5">
                <div className="relative flex items-center justify-between gap-4 rounded-lg bg-primary-normal px-4 py-3 text-white shadow-lg">
                    <p className="text-md text-white font-medium">Could you give us a good review?</p>

                    <button
                        aria-label="Close"
                        className="shrink-0 rounded-lg bg-black/10 p-1 transition hover:bg-black/20"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Notify;
