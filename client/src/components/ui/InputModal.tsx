import clsx from "clsx";

interface InputModalProps {
    label:string
    error:string
    setError:(data:string) => void
    value:string
    setValue:(value:string) => void
}

const InputModal : React.FC<InputModalProps> = ({label,error,setError,value,setValue}) => {
    return (
        <div className="mb-4">
        <label>
        {label}
          <input
            type="text"
            value={value}
            onChange={e => {
              setError('');
              setValue(e.target.value);
            }}
            className={clsx(
              'block w-full rounded-md border-gray-300 shadow-sm mt-2',
              error
                ? 'border-red-300 ring-0 focus:border-red-300 focus:ring-0'
                : 'focus:border-primary-400 focus:ring focus:ring-primary-200 focus:ring-opacity-50'
            )}
            autoComplete="off"
            maxLength={20}
          />
        </label>

        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    )
}

export default InputModal