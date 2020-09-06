(define zero (lambda (f) (lambda (x) x)))
(define succ (lambda (n) (lambda (f) (lambda (x) (f ((n f) x))))))
(define plus-v1 (lambda (m) (lambda (n) (lambda (f) (lambda (x) ((m f) ((n f) x)))))))
(define plus-v2 (lambda (m) (lambda (n) ((m succ) n))))
(define mult-v1 (lambda (m) (lambda (n) ((m (plus n)) zero))))
(define mult-v2 (lambda (m) (lambda (n) (lambda (f) (m (n f))))))
(define exp (lambda (m) (lambda (n) (n m))))
(alias plus plus-v1)
(alias mult mult-v2)
(define one (succ zero))
(define two ((plus one) one))
(define three ((plus two) one))
(define prtnum (lambda (x) ((x add1) 0)))

(define T (lambda (x) (lambda (y) x)))
(define F (lambda (x) (lambda (y) y)))
(define land (lambda (x) (lambda (y) ((x y) F))))
(define lor (lambda (x) (lambda (y) ((x T) y))))
(define lnot (lambda (x) ((x F) T)))
(define prtbool (lambda (x) ((x 'T) 'F)))

(define iszero-v1 (lambda (x) (((x F) lnot) F)))
(define iszero-v2 (lambda (n) ((n (lambda (x) F)) T)))
(alias zeroc? iszero-v1)

;; just for example
;; this is explain below
;; (define cons (lambda (a) (lambda (b) (lambda (x) ((x a)b)))))
;; (define car (lambda (x) (x T)))
;; (define cdr (lambda (x) (x F)))
;; (define Φ (lambda (p) ((cons (succ (car p))) (car p))))
;; (define pred (lambda (n) (car ((n Φ) (lambda (z) ((z zero) zero))))))

;; (define Φ (lambda (p) (lambda (z) ((z (succ (p T))) (p T)))))
;; (define pred (lambda (n) (((n Φ) (lambda (z) ((z zero) zero))) F)))

;; who can understand this?
(define pred (lambda (n) (lambda (f) (lambda (x) (((n (lambda (g) (lambda (h) (h (g f))))) (lambda (u) x)) (lambda (u) u))))))

(define greaterc? (lambda (x) (lambda (y) (zeroc? ((x pred) y)))))
(define eqc? (lambda (x) (lambda (y) ((land ((greaterc? x) y)) ((greaterc? y) x)))))

(define Y (lambda (f) (
                  (lambda (x) (f (x x)))
                  (lambda (x) (f (x x)))
                  )
             ))
(define Z (lambda (f) (
                  (lambda (x) (f (lambda (y) ((x x) y))))
                  (lambda (x) (f (lambda (y) ((x x) y))))
                  )
             ))
(define R (lambda (r) (lambda (n) (((zeroc? n) zero) ((n succ) (r (pred n)))))))
(define FACT (lambda (f) (lambda (x) (((zeroc? x) one) ((mult x) (f (pred x)))))))
(define fact (lambda (f) (lambda (x) (if (eq? x 0)
                               1
                               (* x (f (sub1 x))))))))
