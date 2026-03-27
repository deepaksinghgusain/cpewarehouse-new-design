import React from 'react'

const LearnerSidebar = () => {
    return (
        <div className="self-stretch pt-8 inline-flex flex-col justify-start items-start gap-8">
            <div className="self-stretch pl-6 pr-5 flex flex-col justify-start items-start">
                <div className="self-stretch pl-6 pr-5 flex flex-col justify-start items-start">
                    <img className="w-56 h-10" src="http://srv1246425.hstgr.cloud:3000/uploads/CPEW_Logo_230_42_light_bg_f108e1dbca_5125244a0f.png" />
                </div>
            </div>
            <div className="self-stretch h-64 px-4 py-2 flex flex-col justify-start items-start gap-2">
                <div className="inline-flex justify-start items-start">
                    <div className="w-72 px-3 py-4 bg-Colors-Background-bg-primary rounded-md flex justify-start items-center gap-2 overflow-hidden">
                        <div className="flex-1 flex justify-start items-center gap-3">
                            <div className="w-6 h-6 relative overflow-hidden">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                    <path d="M6 13V15M10 9V15M14 5V15M5.8 19H14.2C15.8802 19 16.7202 19 17.362 18.673C17.9265 18.3854 18.3854 17.9265 18.673 17.362C19 16.7202 19 15.8802 19 14.2V5.8C19 4.11984 19 3.27976 18.673 2.63803C18.3854 2.07354 17.9265 1.6146 17.362 1.32698C16.7202 1 15.8802 1 14.2 1H5.8C4.11984 1 3.27976 1 2.63803 1.32698C2.07354 1.6146 1.6146 2.07354 1.32698 2.63803C1 3.27976 1 4.11984 1 5.8V14.2C1 15.8802 1 16.7202 1.32698 17.362C1.6146 17.9265 2.07354 18.3854 2.63803 18.673C3.27976 19 4.11984 19 5.8 19Z" stroke="#004EEB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                            </div>
                            <div className="justify-start text-blue-700 text-xl font-semibold font-['Inter'] leading-6">Dashboard</div>
                        </div>
                    </div>
                </div>
                <div className="self-stretch inline-flex justify-start items-start">
                    <div className="flex-1 px-3 py-4 bg-Colors-Background-bg-primary rounded-md flex justify-start items-center gap-2 overflow-hidden">
                        <div className="flex-1 flex justify-start items-center gap-3">
                            <div className="w-6 h-6 relative overflow-hidden">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="23" viewBox="0 0 20 23" fill="none">
                                    <path d="M4.5 19H3C1.89543 19 1 18.1046 1 17V3C1 1.89543 1.89543 1 3 1H17C18.1046 1 19 1.89543 19 3V17C19 18.1046 18.1046 19 17 19H15.5M10 18C11.6569 18 13 16.6569 13 15C13 13.3431 11.6569 12 10 12C8.34315 12 7 13.3431 7 15C7 16.6569 8.34315 18 10 18ZM10 18L10.0214 17.9998L6.82867 21.1926L4.00024 18.3641L7.01965 15.3447M10 18L13.1928 21.1926L16.0212 18.3641L13.0018 15.3447M7 5H13M5 8.5H15" stroke="#667085" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                            </div>
                            <div className="justify-start text-Colors-Text-text-secondary-(700) text-xl font-semibold font-['Inter'] leading-6">Certificates</div>
                        </div>
                    </div>
                </div>
                <div className="self-stretch inline-flex justify-start items-start">
                    <div className="flex-1 px-3 py-4 bg-Colors-Background-bg-primary rounded-md flex justify-start items-center gap-2 overflow-hidden">
                        <div className="flex-1 flex justify-start items-center gap-3">
                            <div className="w-6 h-6 relative overflow-hidden">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M4 7.8C4 6.11984 4 5.27976 4.32698 4.63803C4.6146 4.07354 5.07354 3.6146 5.63803 3.32698C6.27976 3 7.11984 3 8.8 3H15.2C16.8802 3 17.7202 3 18.362 3.32698C18.9265 3.6146 19.3854 4.07354 19.673 4.63803C20 5.27976 20 6.11984 20 7.8V21L17.25 19L14.75 21L12 19L9.25 21L6.75 19L4 21V7.8Z" stroke="#667085" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                            </div>
                            <div className="justify-start text-Colors-Text-text-secondary-(700) text-xl font-semibold font-['Inter'] leading-6">Invoices</div>
                        </div>
                    </div>
                </div>
                <div className="self-stretch inline-flex justify-start items-start">
                    <div className="flex-1 px-3 py-4 bg-Colors-Background-bg-primary rounded-md flex justify-start items-center gap-2 overflow-hidden">
                        <div className="flex-1 flex justify-start items-center gap-3">
                            <div className="w-6 h-6 relative overflow-hidden">
                                <svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" viewBox="0 0 23 23" fill="none">
                                    <path d="M10 3.12132H5.8C4.11984 3.12132 3.27976 3.12132 2.63803 3.4483C2.07354 3.73592 1.6146 4.19486 1.32698 4.75935C1 5.40109 1 6.24116 1 7.92132V16.3213C1 18.0015 1 18.8416 1.32698 19.4833C1.6146 20.0478 2.07354 20.5067 2.63803 20.7943C3.27976 21.1213 4.11984 21.1213 5.8 21.1213H14.2C15.8802 21.1213 16.7202 21.1213 17.362 20.7943C17.9265 20.5067 18.3854 20.0478 18.673 19.4833C19 18.8416 19 18.0015 19 16.3213V12.1213M6.99997 15.1213H8.67452C9.1637 15.1213 9.40829 15.1213 9.63846 15.0661C9.84254 15.0171 10.0376 14.9363 10.2166 14.8266C10.4184 14.7029 10.5914 14.53 10.9373 14.1841L20.5 4.62132C21.3284 3.79289 21.3284 2.44975 20.5 1.62132C19.6716 0.792894 18.3284 0.792893 17.5 1.62132L7.93723 11.1841C7.59133 11.53 7.41838 11.7029 7.29469 11.9048C7.18504 12.0837 7.10423 12.2788 7.05523 12.4829C6.99997 12.713 6.99997 12.9576 6.99997 13.4468V15.1213Z" stroke="#667085" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                            </div>
                            <div className="justify-start text-Colors-Text-text-secondary-(700) text-xl font-semibold font-['Inter'] leading-6">Edit profile</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LearnerSidebar