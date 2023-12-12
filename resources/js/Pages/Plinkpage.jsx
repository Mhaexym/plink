import { useForm, Head } from "@inertiajs/react"

export default function Plinkpage({ uuid, requestedPassword, passwordExpired }) {
    // verander hoursleft even naar datetime-local, ook in de input en laat de error zien
    // var date = new Date().toISOString().slice(0, 16);

    // Set the 
    const { data, setData, post, processing, reset } = useForm({
        sharedPassword: '',
        hoursLeft: 1,
        uses: 1,
    });

    const submit = (event) => {
        event.preventDefault();
        post(route('plink.store'), { onSucces: () => reset() });
    }

    const copy = (event) => {
        event.target.disabled = true;
        let store = event.target.value
        navigator.clipboard.writeText(store);
        event.target.value = "Copied to clipboard!"
        setTimeout(() => event.target.value = store, 1500);
        setTimeout(() => event.target.disabled = false, 2500);
    }

    const link = uuid ? "http://127.0.0.1:8000/" + uuid : null;
    const hasLink = uuid ? true : false;
    const hasPassword = requestedPassword ? true : false;

    return (
        <div>
            <Head title='Plink' />
            <div className="bg-gray-800 h-screen items-center justify-center flex font-mono text-white">
                <div className="w-full absolute top-0 p-5 border-b-2 border-red-900">
                    <div className="grid grid-cols-5">
                        <div className="h-100 text-white col-span-1">
                            <div className="flex flex-row justify-center items-end">
                                <h1 className="pb-0 mb-0 text-xl me-2">AVIONICS INTL.</h1>
                                <svg className="h-8 w-8 pb-0 mb-0 text-red-800" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">  <path stroke="none" d="M0 0h24v24H0z" />  <path d="M15 12h5a2 2 0 0 1 0 4h-15l-3 -6h3l2 2h3l-2 -7h3z" transform="rotate(-15 12 12) translate(0 -1)" />  <line x1="3" y1="21" x2="21" y2="21" /></svg>
                            </div>
                        </div>
                        <div className="col-start-2 col-span-3 text-white justify-center items-end flex">
                            {!hasPassword && !passwordExpired && <h1 className="pb-0 mb-0 text-2xl">Creating a plink</h1>}
                            {!hasPassword && passwordExpired && <h1 className="pb-0 mb-0 text-2xl">Expired plink!</h1>}
                            {hasPassword && <h1 className="pb-0 mb-0 text-2xl">Retrieve your password</h1>}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-4 w-full">
                    {!hasPassword && !passwordExpired &&
                        <div className="col-start-2 col-span-2 pb-6">
                            <h2 className="font-bold text-xl">What is plinking?</h2>
                            <p>
                                Welcome to 'plinking', a new feature brought to the Avionics-portal by your trusty devs. Plinking
                                enables users to share sensitive data through temporary-password linking. Create your first password now,
                                and you'll receive a link that you can share with your fellow colleagues, with which they can access your page!
                            </p>
                        </div>
                    }
                    {hasPassword &&
                        <div className="col-start-2 col-span-2 pb-6">
                            <h2 className="font-bold text-xl">Your password is here!</h2>
                            <p>
                                Through 'plinking', a new feature brought to the Avionics-portal by your trusty devs, a secret password has been
                                shared with you with a unique link. Thank you for using our new service. We hope you liked it.
                            </p>
                            <input
                                id='passwordContainer'
                                value={requestedPassword}
                                className="hover:cursor-pointer col-span-4 rounded-3xl w-full ps-6 mt-6 text-black hover:ring-2 hover:ring-blue-600 focus:ring-1 focus:ring-blue-600"
                                onClick={copy}
                                onChange={() => true}
                            ></input>
                            <p className="ps-6 mt-2">
                                Need a new plink? Click <a className="text-red-500 hover:font- hover:text-red-300" href='/'>here</a> to return to our homepage.
                            </p>
                        </div>
                    }
                    {passwordExpired &&
                        <div className="col-start-2 col-span-2 pb-6">
                            <h2 className="font-bold text-xl">This plink has expired...</h2>
                            <p>
                                Unfortunately, the link you tried to use has expired. This can be due to either the number of maximum uses being
                                reached, or the maximum uptime being reached. Need a new plink? Click <a className="text-red-500 hover:font- hover:text-red-300" href='/'>here</a> to return to our homepage.
                            </p>
                        </div>
                    }
                    {!hasPassword && !passwordExpired && !hasLink &&
                        <div className='col-start-2 col-span-2'>
                            <form onSubmit={submit} className="grid grid-cols-4">
                                <input
                                    value={data.sharedPassword}
                                    placeholder="Please type your password here"
                                    className="col-span-3 rounded-tl-3xl me-0 ps-6 text-black hover:ring-2 hover:ring-blue-600 focus:ring-1 focus:ring-blue-600"
                                    onChange={e => setData('sharedPassword', e.target.value)}
                                ></input>
                                <button disabled={processing} className="rounded-e-3xl row-span-3 bg-red-800 col-span-1 hover:bg-red-600 hover:outline-2 hover:ring-2 hover:ring-blue-600 focus:ring-1 focus:ring-blue-600 font-semibold text-white p-3 uppercase">Create plink</button>

                                <div className="col-span-2 bg-red-900 justify-center items-center flex"><h1>Hours of availability:</h1></div>
                                <input
                                    type="number"
                                    min="1"
                                    className="col-span-1 col-start-3 text-black"
                                    onChange={e => setData('hoursLeft', e.target.value)}
                                    value={data.hoursLeft}
                                ></input>

                                <div className="col-span-2 bg-red-900 justify-center items-center flex rounded-bl-3xl"><h1>Number of uses before expiry:</h1></div>
                                <input
                                    type="number"
                                    min="1"
                                    className="col-span-1 col-start-3 text-black"
                                    onChange={e => setData('uses', e.target.value)}
                                    value={data.uses}></input>
                            </form>
                        </div>
                    }

                    {hasLink &&
                        <>
                            <div className="col-start-2 col-span-2">
                                <h2 className="font-bold text-xl mb-2">Your plink is served!</h2>
                                <input className="rounded-3xl py-3 text-black text-center w-full cursor-pointer" value={link} onClick={copy} onChange={() => x}></input>
                            </div>
                            <div className="col-start-4 mt-3">
                                <svg height="75" width="200">
                                    <path className="animate-fade-right" d="M 100 25C 108 0 100 74 5 50" stroke="#C62828" strokeLinecap="round"
                                        strokeLinejoin="round" strokeWidth="5" fill="none" />
                                    <path className="animate-fade-right" d="M5 50 L27 40" stroke="#C62828" strokeLinecap="round"
                                        strokeLinejoin="round" strokeWidth="5" fill="none" />
                                    <path className="animate-fade-right" d="M5 50 L20 67" stroke="#C62828" strokeLinecap="round"
                                        strokeLinejoin="round" strokeWidth="5" fill="none" />

                                    Sorry, your browser does not support inline SVG.
                                </svg>
                                <div className="animate-fade animate-delay-200 ms-4">Click to copy!</div>
                            </div>
                        </>
                    }
                </div>
            </div>
        </div >
    )
}