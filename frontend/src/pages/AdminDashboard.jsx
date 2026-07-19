import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { LogOut, Plus, Trash2, Edit3, Save, X, Eye, EyeOff, Megaphone, ShoppingBag } from "lucide-react";
import api, { formatApiErrorDetail } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { LOGO_URL } from "@/lib/stores";

const emptyProduct = { name: "", category: "", price: "", image_url: "", highlight: "", is_active: true, order: 0 };
const emptyAnn = { message: "", is_active: true, order: 0 };

export default function AdminDashboard() {
  const { admin, logout } = useAuth();
  const [tab, setTab] = useState("products");
  const [products, setProducts] = useState([]);
  const [anns, setAnns] = useState([]);
  const [toast, setToast] = useState(null);

  const showToast = (msg, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 2500);
  };

  const loadProducts = async () => {
    try {
      const { data } = await api.get("/products");
      setProducts(data || []);
    } catch (e) {
      showToast(formatApiErrorDetail(e.response?.data?.detail), false);
    }
  };
  const loadAnns = async () => {
    try {
      const { data } = await api.get("/announcements");
      setAnns(data || []);
    } catch (e) {
      showToast(formatApiErrorDetail(e.response?.data?.detail), false);
    }
  };

  useEffect(() => {
    loadProducts();
    loadAnns();
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white pb-24">
      {/* Top bar */}
      <div className="border-b border-white/10 bg-[#0a0a0a]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-5 md:px-10 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img src={LOGO_URL} alt="DigiConnect" className="h-9 w-9 rounded-lg" />
            <div>
              <p className="text-[10px] uppercase tracking-[0.22em] text-white/50">Admin</p>
              <p className="font-display font-black text-sm">DigiConnect CMS</p>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <span className="hidden sm:block text-xs text-white/50">{admin?.email}</span>
            <Link
              to="/"
              data-testid="admin-view-site"
              className="text-xs font-semibold text-white/70 hover:text-white px-3 py-2 rounded-lg border border-white/10"
            >
              View site
            </Link>
            <button
              data-testid="admin-logout"
              onClick={logout}
              className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-lg bg-white/[0.05] border border-white/10 hover:bg-white/[0.1]"
            >
              <LogOut size={13} /> Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 md:px-10 pt-10">
        <p className="overline">Dashboard</p>
        <h1 className="font-display text-4xl md:text-5xl font-black tracking-tighter mt-2">
          Manage what shoppers see.
        </h1>
        <p className="text-white/60 mt-3 max-w-xl">
          Update featured products and rolling announcements. Changes go live instantly.
        </p>

        {/* Tabs */}
        <div className="mt-10 flex gap-2">
          <button
            data-testid="tab-products"
            onClick={() => setTab("products")}
            className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold border transition-colors ${
              tab === "products"
                ? "bg-[#ff007f] text-white border-[#ff007f]"
                : "bg-white/[0.03] text-white/70 border-white/10 hover:text-white"
            }`}
          >
            <ShoppingBag size={14} /> Products
          </button>
          <button
            data-testid="tab-announcements"
            onClick={() => setTab("announcements")}
            className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold border transition-colors ${
              tab === "announcements"
                ? "bg-[#ff007f] text-white border-[#ff007f]"
                : "bg-white/[0.03] text-white/70 border-white/10 hover:text-white"
            }`}
          >
            <Megaphone size={14} /> Announcements
          </button>
        </div>

        <div className="mt-8">
          {tab === "products" ? (
            <ProductsPanel items={products} reload={loadProducts} showToast={showToast} />
          ) : (
            <AnnouncementsPanel items={anns} reload={loadAnns} showToast={showToast} />
          )}
        </div>
      </div>

      {toast && (
        <div
          data-testid="admin-toast"
          className={`fixed bottom-6 left-1/2 -translate-x-1/2 px-5 py-3 rounded-full text-sm font-bold z-50 ${
            toast.ok ? "bg-[#ff007f] text-white" : "bg-red-500 text-white"
          }`}
        >
          {toast.msg}
        </div>
      )}
    </div>
  );
}

// ---------- Products Panel ----------
function ProductsPanel({ items, reload, showToast }) {
  const [draft, setDraft] = useState(null); // null | 'new' | existing item
  const [form, setForm] = useState(emptyProduct);

  const startNew = () => {
    setDraft("new");
    setForm({ ...emptyProduct, order: items.length });
  };
  const startEdit = (p) => {
    setDraft(p.id);
    setForm({ ...p });
  };
  const cancel = () => {
    setDraft(null);
    setForm(emptyProduct);
  };

  const save = async () => {
    if (!form.name || !form.category) {
      showToast("Name & category required", false);
      return;
    }
    try {
      if (draft === "new") {
        await api.post("/products", form);
        showToast("Product created");
      } else {
        await api.patch(`/products/${draft}`, form);
        showToast("Product updated");
      }
      cancel();
      reload();
    } catch (e) {
      showToast(formatApiErrorDetail(e.response?.data?.detail), false);
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await api.delete(`/products/${id}`);
      showToast("Deleted");
      reload();
    } catch (e) {
      showToast(formatApiErrorDetail(e.response?.data?.detail), false);
    }
  };

  const toggleActive = async (p) => {
    try {
      await api.patch(`/products/${p.id}`, { is_active: !p.is_active });
      reload();
    } catch (e) {
      showToast(formatApiErrorDetail(e.response?.data?.detail), false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm text-white/60">
          {items.length} {items.length === 1 ? "product" : "products"} total
        </p>
        <button
          data-testid="add-product-btn"
          onClick={startNew}
          className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold bg-[#ff007f] text-white hover:bg-[#e60073]"
        >
          <Plus size={14} /> Add product
        </button>
      </div>

      {draft && (
        <FormPanel testIdPrefix="product-form" onCancel={cancel} onSave={save}>
          <FormRow label="Name">
            <input
              data-testid="product-form-name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="dc-input"
            />
          </FormRow>
          <FormRow label="Category">
            <input
              data-testid="product-form-category"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="dc-input"
              placeholder="Smartphone / Wearable / Audio / Tablet"
            />
          </FormRow>
          <FormRow label="Price (display text)">
            <input
              data-testid="product-form-price"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="dc-input"
              placeholder="From ₹79,999"
            />
          </FormRow>
          <FormRow label="Image URL">
            <input
              data-testid="product-form-image"
              value={form.image_url}
              onChange={(e) => setForm({ ...form, image_url: e.target.value })}
              className="dc-input"
              placeholder="https://…"
            />
          </FormRow>
          <FormRow label="Highlight / tagline">
            <input
              data-testid="product-form-highlight"
              value={form.highlight}
              onChange={(e) => setForm({ ...form, highlight: e.target.value })}
              className="dc-input"
            />
          </FormRow>
          <FormRow label="Order (lower = first)">
            <input
              data-testid="product-form-order"
              type="number"
              value={form.order}
              onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
              className="dc-input"
            />
          </FormRow>
          <FormRow label="Active">
            <button
              data-testid="product-form-active"
              type="button"
              onClick={() => setForm({ ...form, is_active: !form.is_active })}
              className={`px-4 py-2 rounded-full text-sm font-bold ${
                form.is_active ? "bg-[#ff007f] text-white" : "bg-white/[0.06] text-white/70"
              }`}
            >
              {form.is_active ? "Active" : "Hidden"}
            </button>
          </FormRow>
        </FormPanel>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        {items.map((p) => (
          <div
            key={p.id}
            data-testid={`admin-product-${p.id}`}
            className="dc-tile p-5 flex gap-4"
          >
            <div className="h-24 w-24 rounded-xl overflow-hidden bg-black/60 shrink-0">
              {p.image_url && (
                <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-[0.22em] text-[#ff007f] font-bold">
                    {p.category}
                  </p>
                  <p className="font-display font-bold truncate">{p.name}</p>
                  <p className="text-xs text-white/50 truncate">{p.highlight}</p>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                    p.is_active ? "bg-[#ff007f]/20 text-[#ff007f]" : "bg-white/10 text-white/60"
                  }`}
                >
                  {p.is_active ? "LIVE" : "HIDDEN"}
                </span>
              </div>
              <div className="mt-3 flex gap-2">
                <IconBtn testId={`edit-product-${p.id}`} onClick={() => startEdit(p)}>
                  <Edit3 size={12} /> Edit
                </IconBtn>
                <IconBtn testId={`toggle-product-${p.id}`} onClick={() => toggleActive(p)}>
                  {p.is_active ? <EyeOff size={12} /> : <Eye size={12} />}
                  {p.is_active ? "Hide" : "Show"}
                </IconBtn>
                <IconBtn testId={`delete-product-${p.id}`} onClick={() => remove(p.id)} danger>
                  <Trash2 size={12} /> Delete
                </IconBtn>
              </div>
            </div>
          </div>
        ))}
        {!items.length && (
          <div className="col-span-full text-center text-white/40 py-14 text-sm">
            No products yet. Click “Add product” to create one.
          </div>
        )}
      </div>

      <style>{`.dc-input { width:100%; background:rgba(0,0,0,0.5); border:1px solid rgba(255,255,255,0.1); border-radius:12px; padding:10px 14px; color:#fff; outline:none; font-size:14px; }
      .dc-input:focus { border-color:#ff007f; }`}</style>
    </div>
  );
}

// ---------- Announcements Panel ----------
function AnnouncementsPanel({ items, reload, showToast }) {
  const [draft, setDraft] = useState(null);
  const [form, setForm] = useState(emptyAnn);

  const startNew = () => {
    setDraft("new");
    setForm({ ...emptyAnn, order: items.length });
  };
  const startEdit = (a) => {
    setDraft(a.id);
    setForm({ ...a });
  };
  const cancel = () => {
    setDraft(null);
    setForm(emptyAnn);
  };
  const save = async () => {
    if (!form.message) {
      showToast("Message is required", false);
      return;
    }
    try {
      if (draft === "new") {
        await api.post("/announcements", form);
        showToast("Announcement created");
      } else {
        await api.patch(`/announcements/${draft}`, form);
        showToast("Announcement updated");
      }
      cancel();
      reload();
    } catch (e) {
      showToast(formatApiErrorDetail(e.response?.data?.detail), false);
    }
  };
  const remove = async (id) => {
    if (!window.confirm("Delete this announcement?")) return;
    try {
      await api.delete(`/announcements/${id}`);
      showToast("Deleted");
      reload();
    } catch (e) {
      showToast(formatApiErrorDetail(e.response?.data?.detail), false);
    }
  };
  const toggleActive = async (a) => {
    try {
      await api.patch(`/announcements/${a.id}`, { is_active: !a.is_active });
      reload();
    } catch (e) {
      showToast(formatApiErrorDetail(e.response?.data?.detail), false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm text-white/60">
          {items.length} {items.length === 1 ? "announcement" : "announcements"}
        </p>
        <button
          data-testid="add-announcement-btn"
          onClick={startNew}
          className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold bg-[#ff007f] text-white hover:bg-[#e60073]"
        >
          <Plus size={14} /> Add announcement
        </button>
      </div>

      {draft && (
        <FormPanel testIdPrefix="ann-form" onCancel={cancel} onSave={save}>
          <FormRow label="Message">
            <input
              data-testid="ann-form-message"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="dc-input"
              placeholder="Now open at Gaur City Mall & Grand Venice Mall"
            />
          </FormRow>
          <FormRow label="Order">
            <input
              data-testid="ann-form-order"
              type="number"
              value={form.order}
              onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
              className="dc-input"
            />
          </FormRow>
          <FormRow label="Active">
            <button
              data-testid="ann-form-active"
              type="button"
              onClick={() => setForm({ ...form, is_active: !form.is_active })}
              className={`px-4 py-2 rounded-full text-sm font-bold ${
                form.is_active ? "bg-[#ff007f] text-white" : "bg-white/[0.06] text-white/70"
              }`}
            >
              {form.is_active ? "Active" : "Hidden"}
            </button>
          </FormRow>
        </FormPanel>
      )}

      <div className="grid grid-cols-1 gap-3 mt-6">
        {items.map((a) => (
          <div
            key={a.id}
            data-testid={`admin-ann-${a.id}`}
            className="dc-tile p-5 flex items-center gap-4"
          >
            <div className="flex-1 min-w-0">
              <p className="font-semibold truncate">{a.message}</p>
              <p className="text-xs text-white/40 mt-1">Order: {a.order}</p>
            </div>
            <span
              className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                a.is_active ? "bg-[#ff007f]/20 text-[#ff007f]" : "bg-white/10 text-white/60"
              }`}
            >
              {a.is_active ? "LIVE" : "HIDDEN"}
            </span>
            <div className="flex gap-2">
              <IconBtn testId={`edit-ann-${a.id}`} onClick={() => startEdit(a)}>
                <Edit3 size={12} />
              </IconBtn>
              <IconBtn testId={`toggle-ann-${a.id}`} onClick={() => toggleActive(a)}>
                {a.is_active ? <EyeOff size={12} /> : <Eye size={12} />}
              </IconBtn>
              <IconBtn testId={`delete-ann-${a.id}`} onClick={() => remove(a.id)} danger>
                <Trash2 size={12} />
              </IconBtn>
            </div>
          </div>
        ))}
        {!items.length && (
          <div className="text-center text-white/40 py-14 text-sm">
            No announcements yet.
          </div>
        )}
      </div>
    </div>
  );
}

// ---------- shared bits ----------
function FormPanel({ children, onCancel, onSave, testIdPrefix }) {
  return (
    <div data-testid={testIdPrefix} className="dc-tile p-6 md:p-8 space-y-4">
      {children}
      <div className="flex gap-2 pt-2">
        <button
          data-testid={`${testIdPrefix}-save`}
          onClick={onSave}
          className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold bg-[#ff007f] text-white hover:bg-[#e60073]"
        >
          <Save size={14} /> Save
        </button>
        <button
          data-testid={`${testIdPrefix}-cancel`}
          onClick={onCancel}
          className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold bg-white/[0.05] border border-white/10 text-white hover:bg-white/[0.1]"
        >
          <X size={14} /> Cancel
        </button>
      </div>
    </div>
  );
}

function FormRow({ label, children }) {
  return (
    <div>
      <label className="block text-[10px] uppercase tracking-[0.22em] text-white/50 font-bold mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}

function IconBtn({ children, onClick, danger, testId }) {
  return (
    <button
      data-testid={testId}
      onClick={onClick}
      className={`inline-flex items-center gap-1 text-[11px] font-bold px-3 py-1.5 rounded-full border transition-colors ${
        danger
          ? "border-red-500/30 text-red-400 hover:bg-red-500/10"
          : "border-white/10 text-white/70 hover:text-white hover:bg-white/[0.06]"
      }`}
    >
      {children}
    </button>
  );
}
