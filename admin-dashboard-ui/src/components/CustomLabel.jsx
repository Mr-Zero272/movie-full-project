import { ExclamationTriangleIcon } from '@heroicons/react/24/solid';
import { Tooltip, Typography } from '@material-tailwind/react';

export function CustomLabel({ label, color, variant, errorMessage, displayErrorMessage = true, className }) {
    return (
        <div className="flex place-content-between">
            <Typography
                variant={variant ? variant : 'h6'}
                color={color ? color : 'blue-gray'}
                className={`${className}`}
            >
                {label}
            </Typography>
            {displayErrorMessage && errorMessage && (
                <Typography className="italic" variant="h6" color="red">
                    <ExclamationTriangleIcon className="h-5 w-5 inline" /> {errorMessage}
                </Typography>
            )}
            {!displayErrorMessage && errorMessage && (
                <Typography className="italic" variant="h6" color="red">
                    <Tooltip
                        className="border border-blue-gray-50 bg-white px-4 py-3 shadow-xl shadow-black/10"
                        content={
                            <div className="w-auto">
                                <Typography color="blue-gray" className="font-medium">
                                    Invalid
                                </Typography>
                                <Typography variant="small" color="blue-gray" className="font-normal opacity-80">
                                    {errorMessage}
                                </Typography>
                            </div>
                        }
                    >
                        <ExclamationTriangleIcon className="h-5 w-5 inline" />
                    </Tooltip>
                </Typography>
            )}
        </div>
    );
}

export default CustomLabel;
