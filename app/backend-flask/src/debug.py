from os import getenv


def initialize_debugger_if_set():

    if getenv("DEBUGGER") == "true":
        import debugpy

        debugger_port = getenv("DEBUGGER_PORT") or "9229"
        debugpy.listen(("0.0.0.0", int(debugger_port)))
        print(
            "Debugger can now be attached to port {}".format(debugger_port),
            flush=True,
        )
        debugpy.wait_for_client()
        print("🎉 Debugger attached, running application. 🎉", flush=True)
