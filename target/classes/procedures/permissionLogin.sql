CREATE OR REPLACE FUNCTION audit.permission_login_html_page(pi_role_id VARCHAR)
 RETURNS refcursor
 LANGUAGE plpgsql
AS $$
DECLARE
  po_cursor                   REFCURSOR;
BEGIN
    OPEN po_cursor FOR
		SELECT array_agg(ap.page_code) AS html
		FROM admin_permision pms
		JOIN admin_page ap
			ON pms.page_id = ap.page_id
		WHERE pms.role_code = pi_role_id::NUMERIC;
  RETURN po_cursor;
END
$$
