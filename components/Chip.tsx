import XIcon from "@/comp/icons/xIcon";

const DefaultChip = ({
  name,
  handleDelete,
}: {
  name: string;
  handleDelete: () => void;
}) => {
  return (
    <div className="container flex gap-1 center-y">
      <p>{name}</p>
      <div className="icon-wrapper p-1" onClick={handleDelete}>
        <XIcon color="var(--primary)" />
      </div>
      <style jsx>
        {`
          .container {
            background-color: var(--primary-alpha-20);
            border-radius: 1px;
            padding: 2px 8px;
          }
          .container:hover {
            background-color: var(--primary-alpha-30);
          }
          .container p {
            color: var(--primary);
            font-weight: 500;
          }

          .icon-wrapper {
            cursor: pointer;
            transition: all 100ms;
            //outline: 1px solid;
          }
          .icon-wrapper:hover {
            border-radius: 50%;
            background-color: var(--primary-alpha-30);
          }
        `}
      </style>
    </div>
  );
};

export default DefaultChip;
