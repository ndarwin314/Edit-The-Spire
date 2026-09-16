from json import dump, load, dumps

def ts_string(value: str) -> str:
    return dumps(value, ensure_ascii=False)

def make_typescript(lines, json_object):
    for item in json_object:
        lines.append("    {")

        for key, value in item.items():
            if value is None:
                lines.append(
                    f'        {key}: null,'
                )
            if value is not None:
                lines.append(
                    f'        {key}: {ts_string(value)},'
                )

        lines.append("    },")

    lines.append("];")
    return "\n".join(lines)