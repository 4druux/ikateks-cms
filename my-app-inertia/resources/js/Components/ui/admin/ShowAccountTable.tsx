import { PenLine, Trash2 } from "lucide-react";
import React from "react";
import Button from "@/Components/common/Button";

export interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    approved_at: string | null;
}

interface ShowAccountTableProps {
    users: User[];
    type: "pending" | "approved";
    onApprove?: (userId: number) => void;
    onReject: (userId: number) => void;
    isProcessing: boolean;
    onOpenResetPasswordModal?: (user: User) => void;
}

const ShowAccountTable: React.FC<ShowAccountTableProps> = ({
    users,
    type,
    onApprove,
    onReject,
    isProcessing,
    onOpenResetPasswordModal,
}) => {
    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead className="bg-slate-50">
                    <tr>
                        <th className="w-16 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                            No.
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                            Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                            Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                            Role
                        </th>
                        <th className="w-48 px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                    {users.map((user: User, index: number) => (
                        <tr
                            key={user.id}
                            className="even:bg-slate-50 hover:bg-slate-100"
                        >
                            <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-800">
                                {index + 1}.
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-800">
                                {user.name}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                {user.email}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 capitalize">
                                {user.role}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 text-center text-sm font-medium">
                                <div className="flex items-center justify-center gap-2">
                                    {type === "pending" &&
                                        onApprove &&
                                        onReject && (
                                            <>
                                                <Button
                                                    size="sm"
                                                    variant="danger"
                                                    onClick={() =>
                                                        onReject(user.id)
                                                    }
                                                    disabled={isProcessing}
                                                >
                                                    Reject
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="success"
                                                    onClick={() =>
                                                        onApprove(user.id)
                                                    }
                                                    disabled={isProcessing}
                                                >
                                                    Approve
                                                </Button>
                                            </>
                                        )}
                                    {type === "approved" &&
                                        onOpenResetPasswordModal &&
                                        onReject && (
                                            <>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() =>
                                                        onOpenResetPasswordModal(
                                                            user
                                                        )
                                                    }
                                                    disabled={isProcessing}
                                                    iconLeft={
                                                        <PenLine className="h-4 w-4" />
                                                    }
                                                >
                                                    {null}
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="danger"
                                                    onClick={() =>
                                                        onReject(user.id)
                                                    }
                                                    disabled={isProcessing}
                                                    iconLeft={
                                                        <Trash2 className="h-4 w-4" />
                                                    }
                                                >
                                                    {null}
                                                </Button>
                                            </>
                                        )}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ShowAccountTable;
