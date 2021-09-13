import { RouterMock } from "@epam/test-utils";
import { AnalyticsContext } from "../AnalyticsContext";

describe("AnalyticsContext", () => {
    beforeEach(() => {
        (window as any).dataLayer = [];
    });
    afterEach(() => {
        delete (window as any).dataLayer;
    });
    
    it("should call listeners", () => {
        const context = new AnalyticsContext({} as any);

        const testEvent1 = {
            name: "test event 1",
        };
        const listener1 = {
            sendEvent: jest.fn(),
        };

        context.addListener(listener1);
        context.sendEvent(testEvent1);

        expect(listener1.sendEvent).toBeCalledTimes(1);
        expect(listener1.sendEvent).toBeCalledWith(testEvent1, {}, "event");

        const testEvent2 = {
            name: "test event 2",
        };
        const listener2 = {
            sendEvent: jest.fn(),
        };

        context.addListener(listener2);
        context.sendEvent(testEvent2);

        expect(listener1.sendEvent).toBeCalledTimes(2);
        expect(listener1.sendEvent).toBeCalledWith(testEvent2, {}, "event");
        expect(listener2.sendEvent).toBeCalledTimes(1);
        expect(listener2.sendEvent).toBeCalledWith(testEvent2, {}, "event");
    });

    it("should listen router", () => {
        const router = new RouterMock();
        const context = new AnalyticsContext({
            router,
            gaCode: "asd",
        } as any);
        const sendEventSpy = jest.spyOn(context, "sendEvent");

        expect(router.listeners.length).toBe(1);

        router.listeners[0]();
        expect(sendEventSpy).toBeCalledTimes(1);
    });
});