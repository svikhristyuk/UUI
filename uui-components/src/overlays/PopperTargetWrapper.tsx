import React, { ReactChild, ReactElement, ReactNode, useEffect, useLayoutEffect, useState } from "react";

interface TooltipWrapperProps {
    children: ReactNode;
    innerRef: any;
}

const PopperTargetWrapperImpl: React.FC<TooltipWrapperProps> = ({ children, innerRef }) => {
    const [node, setNode] = useState<ReactElement | null>(null);
    const [replacedChild, setReplacedChild] = useState<ReactChild | null>(null);

    useLayoutEffect(() => {
        if (typeof children !== "object") return;
        setReplacedChild(
            React.cloneElement(children as ReactElement, {
                ref: (el: ReactElement) => {
                    setNode(el);
                    
                    const { ref } = children as any;
                    if (typeof ref === "function") ref(el);
                },
            }),
        );
    }, [children]);

    useEffect(() => {
        innerRef(node);
    }, [node, innerRef]);

    return (replacedChild ?? children) as ReactElement;
};

export const PopperTargetWrapper = React.memo(PopperTargetWrapperImpl);