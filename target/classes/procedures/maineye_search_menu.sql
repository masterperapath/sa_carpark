CREATE OR REPLACE FUNCTION audit.maineye_search_menu(pi_role_id VARCHAR)
 RETURNS refcursor
 LANGUAGE plpgsql
AS $function$
DECLARE
  po_cursor                   REFCURSOR;
BEGIN
    OPEN po_cursor FOR
		SELECT hm.header_menu_id, hm.header_menu_desc, hm.header_menu_icon, ap.page_code, ap.page_dese
		FROM admin_permision pms
		JOIN admin_page ap
			ON pms.page_id = ap.page_id
		JOIN admin_header_menu hm
			ON hm.header_menu_id = ap.header_menu_id
		WHERE pms.role_code = pi_role_id::NUMERIC
		ORDER BY ap.page_id;
  RETURN po_cursor;
END
$function$
