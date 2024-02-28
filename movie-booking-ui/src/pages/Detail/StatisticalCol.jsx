import PropTypes from 'prop-types';

function StatisticalCol({ headerContent, bodyContent, footerContent, colorHeader, onClick, pointer }) {
    return (
        <div
            className={`flex flex-col justify-start items-center md:flex-row ${pointer ? 'cursor-pointer' : ''}`}
            onClick={onClick}
        >
            <div
                className={`text-4xl font-medium mb-2 md:mr-4 md:text-5xl ${
                    colorHeader !== 'normal' ? (colorHeader === 'red' ? 'text-red-500' : 'text-green-500') : ''
                }`}
            >
                {headerContent}
            </div>
            <div className="flex flex-col justify-center items-center md:items-start">
                <div className="font-medium mb-1">{bodyContent}</div>
                <div className="font-thin text-xl">{footerContent}</div>
            </div>
        </div>
    );
}

StatisticalCol.prototype = {
    colorHeader: PropTypes.oneOf(['green', 'red', 'normal']),
    onClick: PropTypes.func,
};

StatisticalCol.defaultProps = {
    colorHeader: 'normal',
};

export default StatisticalCol;
